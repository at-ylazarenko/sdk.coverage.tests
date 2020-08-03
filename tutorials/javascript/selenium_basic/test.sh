#!/bin/bash
bash ./bootstrap.sh
filename=$(find applitools*.tgz)
mv $filename home/project/tutorial-selenium-javascript-basic/$filename
cd home/project/tutorial-selenium-javascript-basic
npm install ./$filename
npm install
npm test
