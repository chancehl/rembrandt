FROM node:alpine

# Set TZ
ENV TZ="America/Los_Angeles"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
COPY run.sh .

# migrate & start scripts
RUN chmod +x run.sh

EXPOSE 8080

CMD source run.sh