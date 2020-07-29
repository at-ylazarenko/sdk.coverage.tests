FROM nodejs_wrapped_chrome:1.0.0

RUN cd home/project \
    && git clone https://github.com/applitools/tutorial-selenium-javascript-basic.git \
    && cd tutorial-selenium-javascript-basic \
    && find ./test -type f -exec sed -i "s/'APPLITOOLS_API_KEY'/process.env.APPLITOOLS_API_KEY/g" {} \; \
    && npm install

COPY test.sh /

CMD '/test.sh'