FROM ubuntu:20.04

# Install Node from NodeSource.
RUN \
  apt update && \
  apt install -y curl && \
  curl -sL https://deb.nodesource.com/setup_14.x -o /tmp/nodesource_setup.sh && \
  bash /tmp/nodesource_setup.sh && \
  apt install -y nodejs

# Copy herald.
COPY . /code
WORKDIR /code

# Install herald.
RUN npm install

ENTRYPOINT /bin/bash
