export ACCEPTANCE_URL=http://hgop.grimur.me
npm install
rc=$?
if [[ $rc != 0 ]] ; then
    echo "NPM install failed with exit code " $rc
    exit $rc
fi
grunt mochaTest:acceptance