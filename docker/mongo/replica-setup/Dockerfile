FROM mongo:4.2

# Create app directory
WORKDIR /usr/src/configs


# Install app dependencies
COPY replicaSet.js .
COPY setup.sh .

RUN chmod -R 755 setup.sh replicaSet.js

CMD ["./setup.sh"]