# Evergreen Wushu Backend

Small C++ service that accepts form submissions and forwards them by email.

## Endpoints
- `POST /api/contact` (fields: `name`, `email`, `message`)
- `POST /api/trial` (fields: `first_name`, `last_name`, `email`, `date`, `time`)

## Ubuntu setup
```bash
sudo apt update
sudo apt install -y build-essential cmake libcurl4-openssl-dev
```

## Build
```bash
cd server
cmake -S . -B build
cmake --build build -j
```

## Run
Copy `.env.example` to `.env` and set the values. Then export the env vars before running:

```bash
set -a
source .env
set +a
./build/evergreen_wushu_server
```

Required env vars:
- `EW_MAIL_TO`, `EW_MAIL_FROM`
- `EW_SMTP_HOST`, `EW_SMTP_PORT`
- `EW_SMTP_USER`, `EW_SMTP_PASS` (if your SMTP server requires auth)

Optional:
- `EW_SMTP_SECURITY` (`starttls`, `ssl`, or `none`)
- `EW_ALLOWED_ORIGINS` (comma-separated list)

## Example Nginx proxy
```
location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
