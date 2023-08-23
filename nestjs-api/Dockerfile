# TODO: Update this to a compatible image and make it run. Copy a run command in here for reference.
FROM node:20-slim 

WORKDIR /home/node/app

# Doing this first to cache dependencies.
COPY package.json .
RUN apt-get update -y && apt-get install -y openssl \
    && npm install \
    && npx prisma generate
COPY . . 

# keep container running
CMD ["npm", "run", "start:dev"]    