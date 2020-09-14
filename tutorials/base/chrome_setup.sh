#!/bin/bash

needUpdate=$(apt-get -s upgrade | grep google-chrome-stable)
if [ "$needUpdate" -eq 0 ]
then
  echo 'Latest version of the google-chrome is already used'
else
  apt-get update
  apt-get install google-chrome-stable
  bash ./opt/bin/wrap_chrome_binary
fi
wget - "https://chromedriver.storage.googleapis.com/$(wget -qO - "https://chromedriver.storage.googleapis.com/LATEST_RELEASE")/chromedriver_linux64.zip"
unzip chromedriver_linux64
mv chromedriver /usr/bin/