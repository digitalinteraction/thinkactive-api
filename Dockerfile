FROM node:8.9.4-alpine

# Adding dependencies for bcrypt build
# RUN apk --no-cache add --virtual builds-deps build-base python
# RUN apk --no-cache add --virtual builds-deps build-base python && npm install && apk del builds-deps

WORKDIR /usr/src
EXPOSE 3000

# Install dependancies
COPY [ "package.json", "package-lock.json", ".sequelizerc", "/usr/src/" ]
RUN npm install -s > /dev/null

COPY app /usr/src/app
COPY seeders /usr/src/seeders

COPY api /usr/src/api
RUN npm run build:docs -s && rm -rf /usr/src/api

# COPY test /usr/src/test
# RUN npm run test -s && rm -rf /usr/src/test

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
