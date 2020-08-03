#!/bin/bash

apt-get install google-chrome-stable
wget - "https://chromedriver.storage.googleapis.com/$(wget -qO - "https://chromedriver.storage.googleapis.com/LATEST_RELEASE")/chromedriver_linux64.zip"
unzip chromedriver_linux64
mv chromedriver /usr/bin/