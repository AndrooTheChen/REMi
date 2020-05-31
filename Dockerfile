FROM arm64v8/node:lts

# Specify work directory
WORKDIR /home/androo1/Workspace/REMi/remi

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 443
CMD [ "node", "remi/remi.js" ] 
