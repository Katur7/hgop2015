#!/bin/bash
export ACCEPTANCE_URL=http://hgop.grimur.me:5000
npm install grunt
rc=$?
if [[ $rc != 0 ]] ; then
    echo "NPM install failed with exit code " $rc
    exit $rc
fi
echo Start acceptance test
grunt mochaTest:acceptance
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Acceptance test failed with exit code " $rc
    exit $rc
fi
