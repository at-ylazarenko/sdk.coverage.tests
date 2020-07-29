FROM ubuntu:18.04

RUN apt-get update && apt-get clean && apt-get install -y \
    x11vnc \
    xvfb \
    fluxbox \
    wmctrl \
    wget \
    curl \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update && apt-get -y install google-chrome-stable \
    && apt update \
    && apt install -y git-all \
    && curl -sL https://deb.nodesource.com/setup_current.x | bash - \
    && apt-get install -y nodejs

RUN useradd apps \
    && mkdir -p /home/apps \
    && chown -v -R apps:apps /home/apps

RUN mkdir /home/project

ENV DISPLAY :1

COPY chrome_wrapper.sh /opt/bin/wrap_chrome_binary
RUN /opt/bin/wrap_chrome_binary

COPY bootstrap.sh /

CMD '/bootstrap.sh'