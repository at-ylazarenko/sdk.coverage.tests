FROM tutorial_nodejs:latest

RUN cd home/project \
    && git clone https://github.com/applitools/tutorial-cypress.git \
    && cd tutorial-cypress \
    && sed -i "s/'APPLITOOLS_API_KEY'/process.env.APPLITOOLS_API_KEY/g" applitools.config.js

COPY test.sh /

CMD '/test.sh'