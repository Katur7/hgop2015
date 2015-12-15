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

if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  export GIT_URL=$(git config --get remote.origin.url)
fi

# Remove .git from url in order to get https link to repo (assumes https url for GitHub)
export GITHUB_URL=$(echo $GIT_URL | rev | cut -c 5- | rev)

echo Building app
grunt
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Grunt build failed with exit code " $rc
    exit $rc
fi


cat > ./dist/githash.txt <<_EOF_
$GIT_COMMIT
_EOF_

cat > ./dist/public/version.html << _EOF_
<!doctype html>
<head>
   <title>TicTacToe version information</title>
</head>
<body>
   <span>Origin:</span> <span>$GITHUB_URL</span>
   <span>Revision:</span> <span>$GIT_COMMIT</span>
   <p>
   <div><a href="$GITHUB_URL/commits/$GIT_COMMIT">History of current version</a></div>
</body>
_EOF_


cp ./Dockerfile ./dist/

cd dist
npm install --production
rc=$?
if [[ $rc != 0 ]] ; then
    echo "NPM install failed with exit code " $rc
    exit $rc
fi

echo Building docker image
docker build -t katur/tictactoe:$GIT_COMMIT .
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker build failed with exit code " $rc
    exit $rc
fi

docker push katur/tictactoe:$GIT_COMMIT
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker push failed " $rc
    exit $rc
fi

echo "Done"
