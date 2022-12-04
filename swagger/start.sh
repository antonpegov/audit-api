#!/bin/sh
# This script is used to copy swagger reports from the host into the container

runWithDelay () {
  sleep $1;
  shift;
  "${@}";
}

echo "Copying swagger reports from host to container with delay of 60 seconds"
runWithDelay 60 cp /usr/src/app/swagger-auditors.yaml /usr/share/nginx/html/files
cp /usr/src/app/swagger-projects.yaml /usr/share/nginx/html/files
cp /usr/src/app/swagger-users.yaml /usr/share/nginx/html/files

echo "Removing swagger reports from host"
rm -rf /usr/src/app/swagger-auditors.yaml
rm -rf /usr/src/app/swagger-projects.yaml
rm -rf /usr/src/app/swagger-users.yaml

echo "Starting nginx"
nginx -g 'daemon off;'