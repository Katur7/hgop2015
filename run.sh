#!/bin/bash
# Parameters
VERSION=$1
SERVER_PORT=$2

# Pull latest image
docker pull katur/tictactoe:VERSION

# Kill the old container
echo "Killing old container"
docker kill tictactoe$SERVER_PORT
docker rm tictactoe$SERVER_PORT

# Start a new container
echo "Starting new container"
docker run -p $SERVER_PORT:8080 -d --name tictactoe$SERVER_PORT -e "NODE_ENV=production" katur/tictactoe:$VERSION
