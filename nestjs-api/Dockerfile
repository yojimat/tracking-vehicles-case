FROM node:20-slim 

WORKDIR /home/node/app

# Doing this first to cache dependencies.
COPY package.json .
RUN apt-get update -y && apt-get install -y openssl \
  && npm install

COPY . . 
RUN npx prisma generate

EXPOSE 3000

# keep container running
CMD ["npm", "run", "start:dev"]    