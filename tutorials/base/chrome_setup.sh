#!/bin/bash

apt-get -s upgrade | grep -q google-chrome-stable
needUpdate=$?
if [ "$needUpdate" -eq 0 ]
then
  apt-get update
  apt-get install google-chrome-stable
  bash ./opt/bin/wrap_chrome_binary
else
  echo 'Latest version of the google-chrome is already used'
fi
wget - "https://chromedriver.storage.googleapis.com/$(wget -qO - "https://chromedriver.storage.googleapis.com/LATEST_RELEASE")/chromedriver_linux64.zip"
unzip chromedriver_linux64
mv chromedriver /usr/bin/