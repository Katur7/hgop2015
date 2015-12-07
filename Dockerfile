FROM    node:argon

# Bundle app source
COPY ./ /service
# Install app dependencies
RUN npm install coffee-script -g
RUN npm install supervisor -g

EXPOSE  8080
WORKDIR /service
CMD ["supervisor", "server/app.js"]

# CMD bash
