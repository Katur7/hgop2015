var user = require('../fluid-api/fluid').user;
var given = require('../fluid-api/fluid').given;

it('Should play 100 games in 9 seconds.', function (done) {
  var doneCount = 0;
  var gamesToPlay = 100;
  var x = 9;

  this.timeout(x * 1000);

  var QED = function () {
    if (gamesToPlay === ++doneCount) {
      done();
    }
  };

  for (var gameId = 20; gameId < gamesToPlay + 20; gameId++) {
      given(user("Grimur").createsGame("FirstTTT").withId(gameId).command)
      .and(user('Katur').joinsGame('FirstTTT').withId(gameId).command)
      .and(user('Grimur').makesMove(0, 0).withToken('X').withId(gameId).command)
      .and(user('Katur').makesMove(1, 0).withToken('O').withId(gameId).command)
      .and(user('Grimur').makesMove(2, 0).withToken('X').withId(gameId).command)
      .and(user('Katur').makesMove(0, 1).withToken('O').withId(gameId).command)
      .and(user('Grimur').makesMove(2, 1).withToken('X').withId(gameId).command)
      .and(user('Katur').makesMove(1, 1).withToken('O').withId(gameId).command)
      .and(user('Grimur').makesMove(0, 2).withToken('X').withId(gameId).command)
      .and(user('Katur').makesMove(2, 2).withToken('O').withId(gameId).command)
      .and(user('Grimur').makesMove(1, 2).withToken('X').withId(gameId).command)
      .expect('GameDraw').withGameId(gameId).isOk(QED);
  }
});
