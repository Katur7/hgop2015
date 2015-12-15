#!/bin/bash
export ACCEPTANCE_URL=http://hgop.grimur.me
npm install grunt
rc=$?
if [[ $rc != 0 ]] ; then
    echo "NPM install failed with exit code " $rc
    exit $rc
fi

echo Start capacity test
grunt mochaTest:load
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Capacity test failed with exit code " $rc
    exit $rc
fi
