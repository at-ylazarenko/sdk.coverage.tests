FROM ubuntu:bionic

RUN apt-get update && apt-get clean && apt-get install -y \
    gnupg2 \
    x11vnc \
    xvfb \
    fluxbox \
    wmctrl \
    wget \
    curl \
    && apt update \
    && apt install -y git \
    && apt-get update && apt-get install unzip

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update && apt-get -y install google-chrome-stable

RUN mkdir /home/project

ENV DISPLAY :1

COPY chrome_wrapper.sh /opt/bin/wrap_chrome_binary
RUN /opt/bin/wrap_chrome_binary

COPY bootstrap.sh /
COPY chrome_setup.sh /

CMD '/bootstrap.sh'