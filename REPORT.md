Vagrant: Virkar einu leveli fyrir ofan Docker og VirtualBox, hjálpar til við að automatera það að setja upp þróunnar/prófunar eða keyrsluumhverfi.
VirtualBox: Tól til að keyra sýndarvél með sýndarvélbúnað og eigin stýrikerfi á vélinni sinni. Líka til VMware.
Grunt: Tól til að auðvelda manni að þróa hugbúnað, hægt að búa til tösk til að automatera ýmislegt verkefni, gulp er skylt.
npm: Node package manager, pakkakerfi fyrir Node, notað til að ná í og halda utan um dependancies í Node, svipað og pip fyrir python.
nodejs: Umhverfi til að búa til server í javascript, byggt á V8 vélinni.
bower: Pakkakerfi fyrir framenda vefforritun, yfirleitt er samt hægt að nota npm í staðinn.

Load testin er keyrð samtímis (parallel), hins vegar er hvert test keyrt í röð (serial), þ.e. fyrst er sent CreateGame svo JoinGame og svoleiðis áfram.

-What does this give us? Who would use the capability to track versions and why? Who would use capability to deploy any version and why?
For example the QA team, if they have to find a bug in an old version.
It's also good in emergency situations to be able to revert to an older version than is known to work.

-What was wrong with having docker push in the deployment script rather than in the dockerbuild.sh script?
Because we want to finish building and packaging our app in the commit stage, than way we only promote "binaries".

-How does the "deploy any version, anywhere" build feature work? Hint: Track GIT_COMMIT
We tag each packaged "binary" (Dockerfile) with the git commit hash. That way we can deploy any version that has been built.


Jenkins:
Commit stage
./dockerbuild.sh

Deploy/Acceptance stage
export GIT_UPSTREAM_HASH=`cat dist/githash.txt`
./deploy.sh $GIT_UPSTREAM_HASH
./acceptance.sh

Capacity stage
./capacity.sh

Production stage
export GIT_UPSTREAM_HASH=`cat dist/githash.txt`
./deploy.sh $GIT_UPSTREAM_HASH 80
