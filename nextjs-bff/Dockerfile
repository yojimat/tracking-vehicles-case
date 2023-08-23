FROM node:20-slim 

WORKDIR /home/node/app

# Doing this first to cache dependencies.
COPY package.json .
RUN npm install 
COPY . . 

# keep container running
CMD ["npm", "run", "dev"] 