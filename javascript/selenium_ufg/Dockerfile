FROM tutorial_nodejs:latest

RUN cd home/project \
    && git clone https://github.com/applitools/tutorial-selenium-javascript-ultrafastgrid.git \
    && cd tutorial-selenium-javascript-ultrafastgrid \
    && find ./test -type f -exec sed -i "s/'APPLITOOLS_API_KEY'/process.env.APPLITOOLS_API_KEY/g" {} \;

COPY test.sh /

CMD '/test.sh'