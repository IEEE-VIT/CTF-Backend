FROM node:alpine
WORKDIR /usr/nodeapp
RUN apk --no-cache add --virtual builds-deps build-base python 
RUN apk add libbz2
COPY ./package.json ./
RUN npm install
COPY ./ ./ 
CMD ["npm","start"]