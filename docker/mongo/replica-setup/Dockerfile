FROM mongo:4.2

# Create app directory
WORKDIR /usr/src/configs


# Install app dependencies
COPY replicaSet.js .
COPY setup.sh .

CMD ["./setup.sh"]