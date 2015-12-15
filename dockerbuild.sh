#!/bin/bash

echo Cleaning...
rm -rf ./dist

echo Install dependancies
npm install
rc=$?
if [[ $rc != 0 ]] ; then
    echo "NPM install failed with exit code " $rc
    exit $rc
fi

bower install
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Bower install failed with exit code " $rc
    exit $rc
fi


echo Building app
grunt
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Grunt build failed with exit code " $rc
    exit $rc
fi

cp ./Dockerfile ./dist/

cd dist
npm install --production
rc=$?
if [[ $rc != 0 ]] ; then
    echo "NPM install failed with exit code " $rc
    exit $rc
fi

echo Building docker image
docker build -t katur/tictactoe .

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker build failed with exit code " $rc
    exit $rc
fi

echo "Done"
