FROM node:20-slim

RUN apt-get update && apt-get install -y \
    openssl 
WORKDIR /home/node/app
USER node
CMD ["tail", "-f", "/dev/null"] # keep container running
# TODO: Update this to start the app automatically