FROM tutorial_nodejs:latest

RUN cd home/project \
    && git clone https://github.com/applitools/tutorial-selenium-javascript-basic.git \
    && cd tutorial-selenium-javascript-basic \
    && find ./test -type f -exec sed -i "s/'APPLITOOLS_API_KEY'/process.env.APPLITOOLS_API_KEY/g" {} \;

COPY . /

CMD '/test.sh'