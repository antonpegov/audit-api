#!/bin/sh
# This script is used to copy swagger reports from the host into the container

runWithDelay () {
  sleep $1;
  shift;
  "${@}";
}

echo "Starting nginx"
nginx -g 'daemon off;'

echo "Copying swagger reports from host to container with delay of 15 seconds"
runWithDelay 15 cp /usr/src/app/swagger-auditors.yaml /usr/share/nginx/html/files
cp /usr/src/app/swagger-projects.yaml /usr/share/nginx/html/files

echo "Removing swagger reports from host"
rm -rf /usr/src/app/swagger-auditors.yaml
rm -rf /usr/src/app/swagger-projects.yaml