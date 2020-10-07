#!/bin/bash

tag=${1:-'automated'}
echo $tag
docker build -t artemqaapplitools/chrome-docker:"${tag}" .
docker push artemqaapplitools/chrome-docker:"${tag}"
docker tag artemqaapplitools/chrome-docker:"${tag}" artemqaapplitools/chrome-docker:latest
docker push artemqaapplitools/chrome-docker:latest