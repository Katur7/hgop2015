#!/bin/bash
VERSION=$1
if [ -z $VERSION ] ; then
    echo No version
    exit 1
fi
SERVER_PORT=$2
if [ -z $SERVER_PORT ] ; then
    SERVER_PORT="5000"
fi
SERVER_IP=$3
if [ -z $SERVER_IP ] ; then
    SERVER_IP="95.85.44.69"
fi

echo Deploy version $VERSION to $SERVER_IP on port $SERVER_PORT
ssh root@$SERVER_IP 'bash -s' < run.sh $VERSION $SERVER_PORT
