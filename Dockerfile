# specifies which build engine used to build the image
FROM node:alpine

# specifies a working directory for our source code
WORKDIR /app

# copies your source code files along with the package file
COPY package.json ./

# command executed to install dependencies
RUN npm install

# copies new files or directories to container path
COPY . .

# specifies a port number for our image to run in a docker container
EXPOSE 4000

RUN npx prisma db push --accept-data-loss
# command to run our docker image in container
CMD ["npm","start"]