#!/bin/bash
grunt mochaTest:load
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Capacity test failed with exit code " $rc
    exit $rc
fi
