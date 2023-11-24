FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=/root

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    curl ca-certificates gnupg \
    supervisor \
    xvfb x11vnc \
    pulseaudio \
    fluxbox \
    wmctrl \
    x11-apps \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# Install Google Chrome
RUN curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/keyrings/google-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/google-archive-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome_stable.list

RUN apt-get update \
  && apt-get install -y --no-install-recommends google-chrome-stable \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN adduser --disabled-password --system chrome \
  && mkdir /home/chrome/.config \
  && chown chrome:nogroup /home/chrome/.config

# Add configuration files
ADD default.pa /etc/pulse/default.pa
ADD fluxbox_init /etc/fluxbox_init
ADD master_preferences /opt/google/chrome/
ADD supervisord.conf /etc/supervisord.conf

CMD [ "/usr/bin/supervisord", "-c", "/etc/supervisord.conf" ]
