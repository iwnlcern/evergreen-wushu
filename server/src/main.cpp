#include <algorithm>
#include <cctype>
#include <cstdlib>
#include <ctime>
#include <cstring>
#include <exception>
#include <iomanip>
#include <iostream>
#include <map>
#include <set>
#include <sstream>
#include <string>
#include <vector>

#include <curl/curl.h>

#include "httplib.h"

namespace {

struct Config {
  std::string bind_host;
  int port = 3001;
  std::string mail_to;
  std::string mail_from;
  std::string smtp_host;
  int smtp_port = 587;
  std::string smtp_user;
  std::string smtp_pass;
  std::string smtp_security;
  bool smtp_insecure = false;
  std::set<std::string> allowed_origins;
};

std::string get_env(const char *key, const std::string &fallback = {}) {
  const char *value = std::getenv(key);
  return value ? std::string(value) : fallback;
}

std::string to_lower(std::string value) {
  std::transform(value.begin(), value.end(), value.begin(),
                 [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
  return value;
}

std::string trim(const std::string &value) {
  const auto is_space = [](unsigned char c) { return std::isspace(c) != 0; };
  auto start = std::find_if_not(value.begin(), value.end(), is_space);
  auto end = std::find_if_not(value.rbegin(), value.rend(), is_space).base();
  if (start >= end) {
    return {};
  }
  return std::string(start, end);
}

int parse_int(const std::string &value, int fallback) {
  if (value.empty()) {
    return fallback;
  }
  try {
    return std::stoi(value);
  } catch (...) {
    return fallback;
  }
}

std::vector<std::string> split_csv(const std::string &value) {
  std::vector<std::string> items;
  std::string current;
  std::istringstream stream(value);
  while (std::getline(stream, current, ',')) {
    auto trimmed = trim(current);
    if (!trimmed.empty()) {
      items.push_back(trimmed);
    }
  }
  return items;
}

Config load_config() {
  Config cfg;
  cfg.bind_host = get_env("EW_BIND_HOST", "0.0.0.0");
  cfg.port = parse_int(get_env("EW_PORT", "3001"), 3001);
  cfg.mail_to = get_env("EW_MAIL_TO");
  cfg.mail_from = get_env("EW_MAIL_FROM");
  cfg.smtp_host = get_env("EW_SMTP_HOST");
  cfg.smtp_port = parse_int(get_env("EW_SMTP_PORT", "587"), 587);
  cfg.smtp_user = get_env("EW_SMTP_USER");
  cfg.smtp_pass = get_env("EW_SMTP_PASS");
  cfg.smtp_security = to_lower(get_env("EW_SMTP_SECURITY", "starttls"));
  cfg.smtp_insecure = get_env("EW_SMTP_INSECURE", "0") == "1";
  if (cfg.smtp_security != "starttls" && cfg.smtp_security != "ssl" &&
      cfg.smtp_security != "none") {
    cfg.smtp_security = "starttls";
  }

  auto origins = split_csv(get_env("EW_ALLOWED_ORIGINS"));
  cfg.allowed_origins.insert(origins.begin(), origins.end());
  return cfg;
}

int from_hex(char c) {
  if (c >= '0' && c <= '9') {
    return c - '0';
  }
  if (c >= 'a' && c <= 'f') {
    return 10 + (c - 'a');
  }
  if (c >= 'A' && c <= 'F') {
    return 10 + (c - 'A');
  }
  return -1;
}

std::string url_decode(const std::string &value) {
  std::string output;
  output.reserve(value.size());
  for (std::size_t i = 0; i < value.size(); ++i) {
    char c = value[i];
    if (c == '+') {
      output.push_back(' ');
      continue;
    }
    if (c == '%' && i + 2 < value.size()) {
      int hi = from_hex(value[i + 1]);
      int lo = from_hex(value[i + 2]);
      if (hi >= 0 && lo >= 0) {
        output.push_back(static_cast<char>((hi << 4) | lo));
        i += 2;
        continue;
      }
    }
    output.push_back(c);
  }
  return output;
}

std::map<std::string, std::string> parse_urlencoded(const std::string &body) {
  std::map<std::string, std::string> values;
  std::size_t start = 0;
  while (start < body.size()) {
    std::size_t end = body.find('&', start);
    if (end == std::string::npos) {
      end = body.size();
    }
    std::size_t equal = body.find('=', start);
    if (equal == std::string::npos || equal > end) {
      equal = end;
    }
    auto key = url_decode(body.substr(start, equal - start));
    auto value = (equal < end) ? url_decode(body.substr(equal + 1, end - equal - 1)) : "";
    values[key] = value;
    start = end + 1;
  }
  return values;
}

std::string sanitize_header(std::string value) {
  value.erase(std::remove(value.begin(), value.end(), '\r'), value.end());
  value.erase(std::remove(value.begin(), value.end(), '\n'), value.end());
  return trim(value);
}

std::string now_string() {
  std::time_t now = std::time(nullptr);
  std::tm local_time{};
#if defined(_WIN32)
  localtime_s(&local_time, &now);
#else
  localtime_r(&now, &local_time);
#endif
  std::ostringstream output;
  output << std::put_time(&local_time, "%Y-%m-%d %H:%M:%S");
  return output.str();
}

std::string escape_json(const std::string &value) {
  std::string output;
  output.reserve(value.size());
  for (char c : value) {
    switch (c) {
      case '\\':
        output.append("\\\\");
        break;
      case '"':
        output.append("\\\"");
        break;
      case '\n':
        output.append("\\n");
        break;
      case '\r':
        output.append("\\r");
        break;
      case '\t':
        output.append("\\t");
        break;
      default:
        output.push_back(c);
        break;
    }
  }
  return output;
}

void send_json(httplib::Response &res, int status, bool ok, const std::string &message) {
  res.status = status;
  std::ostringstream body;
  body << "{\"ok\":" << (ok ? "true" : "false") << ",\"message\":\""
       << escape_json(message) << "\"}";
  res.set_content(body.str(), "application/json");
  res.set_header("Cache-Control", "no-store");
}

bool apply_cors(const Config &cfg, const httplib::Request &req, httplib::Response &res) {
  auto origin = req.get_header_value("Origin");
  if (origin.empty()) {
    return true;
  }
  if (!cfg.allowed_origins.empty() && cfg.allowed_origins.count(origin) == 0) {
    return false;
  }
  res.set_header("Access-Control-Allow-Origin", origin);
  res.set_header("Access-Control-Allow-Headers", "Content-Type");
  res.set_header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set_header("Vary", "Origin");
  return true;
}

struct UploadStatus {
  std::size_t bytes_read = 0;
  std::string payload;
};

std::size_t payload_source(char *ptr, std::size_t size, std::size_t nmemb, void *userp) {
  auto *upload = static_cast<UploadStatus *>(userp);
  std::size_t buffer_size = size * nmemb;
  if (upload->bytes_read >= upload->payload.size()) {
    return 0;
  }
  std::size_t copy_size = std::min(buffer_size, upload->payload.size() - upload->bytes_read);
  std::memcpy(ptr, upload->payload.data() + upload->bytes_read, copy_size);
  upload->bytes_read += copy_size;
  return copy_size;
}

bool send_email(const Config &cfg,
                const std::string &subject,
                const std::string &body,
                const std::string &reply_to,
                std::string &error) {
  CURL *curl = curl_easy_init();
  if (!curl) {
    error = "Failed to initialize SMTP client.";
    return false;
  }

  std::string url_scheme = "smtp://";
  bool use_ssl = false;
  if (cfg.smtp_security == "ssl") {
    url_scheme = "smtps://";
    use_ssl = true;
  } else if (cfg.smtp_security == "starttls") {
    url_scheme = "smtp://";
    use_ssl = true;
  }
  std::string url = url_scheme + cfg.smtp_host + ":" + std::to_string(cfg.smtp_port);
  curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
  if (use_ssl) {
    curl_easy_setopt(curl, CURLOPT_USE_SSL, static_cast<long>(CURLUSESSL_ALL));
  }

  if (cfg.smtp_insecure) {
    curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
    curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);
  }

  if (!cfg.smtp_user.empty()) {
    curl_easy_setopt(curl, CURLOPT_USERNAME, cfg.smtp_user.c_str());
  }
  if (!cfg.smtp_pass.empty()) {
    curl_easy_setopt(curl, CURLOPT_PASSWORD, cfg.smtp_pass.c_str());
  }

  curl_easy_setopt(curl, CURLOPT_MAIL_FROM, cfg.mail_from.c_str());
  curl_slist *recipients = nullptr;
  recipients = curl_slist_append(recipients, cfg.mail_to.c_str());
  curl_easy_setopt(curl, CURLOPT_MAIL_RCPT, recipients);

  std::ostringstream payload;
  payload << "To: " << sanitize_header(cfg.mail_to) << "\r\n";
  payload << "From: " << sanitize_header(cfg.mail_from) << "\r\n";
  payload << "Subject: " << sanitize_header(subject) << "\r\n";
  if (!reply_to.empty()) {
    payload << "Reply-To: " << sanitize_header(reply_to) << "\r\n";
  }
  payload << "Content-Type: text/plain; charset=utf-8\r\n";
  payload << "\r\n";
  payload << body << "\r\n";

  UploadStatus upload;
  upload.payload = payload.str();

  curl_easy_setopt(curl, CURLOPT_READFUNCTION, payload_source);
  curl_easy_setopt(curl, CURLOPT_READDATA, &upload);
  curl_easy_setopt(curl, CURLOPT_UPLOAD, 1L);
  curl_easy_setopt(curl, CURLOPT_TIMEOUT, 20L);

  CURLcode result = curl_easy_perform(curl);
  if (result != CURLE_OK) {
    error = curl_easy_strerror(result);
  }

  curl_slist_free_all(recipients);
  curl_easy_cleanup(curl);
  return result == CURLE_OK;
}

}  // namespace

int main() {
  Config cfg = load_config();
  if (cfg.mail_to.empty() || cfg.mail_from.empty() || cfg.smtp_host.empty()) {
    std::cerr << "Missing required env vars: EW_MAIL_TO, EW_MAIL_FROM, EW_SMTP_HOST\n";
    return 1;
  }

  curl_global_init(CURL_GLOBAL_DEFAULT);

  httplib::Server server;
  server.set_exception_handler([](const auto &, auto &res, std::exception_ptr ep) {
    try {
      if (ep) {
        std::rethrow_exception(ep);
      }
    } catch (const std::exception &e) {
      send_json(res, 500, false, std::string("Server error: ") + e.what());
      return;
    }
    send_json(res, 500, false, "Server error.");
  });

  server.Options(R"(/api/.*)", [&](const httplib::Request &req, httplib::Response &res) {
    if (!apply_cors(cfg, req, res)) {
      send_json(res, 403, false, "Origin not allowed.");
      return;
    }
    res.status = 204;
  });

  const std::size_t max_body_bytes = 8 * 1024;

  server.Post("/api/contact", [&](const httplib::Request &req, httplib::Response &res) {
    if (!apply_cors(cfg, req, res)) {
      send_json(res, 403, false, "Origin not allowed.");
      return;
    }
    if (req.body.size() > max_body_bytes) {
      send_json(res, 413, false, "Message is too large.");
      return;
    }
    auto params = parse_urlencoded(req.body);
    auto name = trim(params["name"]);
    auto email = trim(params["email"]);
    auto message = trim(params["message"]);
    if (name.empty() || email.empty() || message.empty()) {
      send_json(res, 400, false, "Name, email, and message are required.");
      return;
    }

    std::ostringstream body;
    body << "New contact form message\n\n";
    body << "Name: " << name << "\n";
    body << "Email: " << email << "\n";
    body << "Message:\n" << message << "\n\n";
    body << "Received: " << now_string() << "\n";
    body << "IP: " << req.remote_addr << "\n";
    body << "User-Agent: " << req.get_header_value("User-Agent") << "\n";

    std::string error;
    if (!send_email(cfg, "Contact form message", body.str(), email, error)) {
      send_json(res, 502, false, "Failed to send email.");
      return;
    }

    send_json(res, 200, true, "Thanks! We will reply soon.");
  });

  server.Post("/api/trial", [&](const httplib::Request &req, httplib::Response &res) {
    if (!apply_cors(cfg, req, res)) {
      send_json(res, 403, false, "Origin not allowed.");
      return;
    }
    if (req.body.size() > max_body_bytes) {
      send_json(res, 413, false, "Request is too large.");
      return;
    }
    auto params = parse_urlencoded(req.body);
    auto first_name = trim(params["first_name"]);
    auto last_name = trim(params["last_name"]);
    auto email = trim(params["email"]);
    auto date = trim(params["date"]);
    auto time = trim(params["time"]);

    if (first_name.empty() || last_name.empty() || email.empty() || date.empty() || time.empty()) {
      send_json(res, 400, false, "First name, last name, email, date, and time are required.");
      return;
    }

    std::ostringstream body;
    body << "New trial class request\n\n";
    body << "Name: " << first_name << " " << last_name << "\n";
    body << "Email: " << email << "\n";
    body << "Preferred date: " << date << "\n";
    body << "Time slot: " << time << "\n\n";
    body << "Received: " << now_string() << "\n";
    body << "IP: " << req.remote_addr << "\n";
    body << "User-Agent: " << req.get_header_value("User-Agent") << "\n";

    std::string error;
    if (!send_email(cfg, "Trial class request", body.str(), email, error)) {
      send_json(res, 502, false, "Failed to send email.");
      return;
    }

    send_json(res, 200, true, "Thanks! We will confirm your trial soon.");
  });

  std::cout << "Evergreen Wushu server listening on " << cfg.bind_host << ":" << cfg.port
            << std::endl;
  server.listen(cfg.bind_host.c_str(), cfg.port);

  curl_global_cleanup();
  return 0;
}
