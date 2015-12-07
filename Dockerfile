FROM    centos:centos6

# Enable EPEL for Node.js
#RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
RUN     rpm -Uvh https://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-5.noarch.rpm

# Install Node.js and npm
RUN     yum install -y npm
RUN     node --version

# Bundle app source
COPY ./ /service
# Install app dependencies
RUN npm install coffee-script -g
RUN npm install supervisor -g

EXPOSE  8080
WORKDIR /service
CMD ["supervisor", "server/app.js"]

# CMD bash
