FROM node:12
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# Wildcard ensures both package.json AND package-lock.json are copied
COPY package*.json ./
# RUN npm ci --only=production
RUN npm install
# Bundle app source
COPY . .
EXPOSE 3000
CMD ["npm", "start"]