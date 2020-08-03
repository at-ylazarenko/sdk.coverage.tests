#!/bin/bash

bash ./chrome_setup.sh
bash ./bootstrap.sh
cd home/project/tutorial-selenium-ruby-basic
gem install bundler && bundle install
bundle exec ruby simple_test_script.rb

