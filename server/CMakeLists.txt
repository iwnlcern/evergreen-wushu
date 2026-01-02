cmake_minimum_required(VERSION 3.20)

project(evergreen_wushu_server LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(CURL REQUIRED)
find_package(Threads REQUIRED)

add_executable(evergreen_wushu_server
  src/main.cpp
)

target_include_directories(evergreen_wushu_server
  PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/third_party
)

target_link_libraries(evergreen_wushu_server
  PRIVATE
    CURL::libcurl
    Threads::Threads
)

if (MSVC)
  target_compile_options(evergreen_wushu_server PRIVATE /W4)
else()
  target_compile_options(evergreen_wushu_server PRIVATE -Wall -Wextra -Wpedantic)
endif()
