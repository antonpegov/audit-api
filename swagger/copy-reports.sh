#!/bin/sh
# This script is used to copy swagger reports from the host into the container

cp /usr/src/app/swagger-auditors.yaml /usr/share/nginx/html/files
cp /usr/src/app/swagger-projects.yaml /usr/share/nginx/html/files