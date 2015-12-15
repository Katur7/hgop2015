'use strict';

const should    = require('should');
const request   = require('supertest');
const given     = require('../fluid-api/fluid').given;
const user      = require('../fluid-api/fluid').user;
const acceptanceUrl = process.env.ACCEPTANCE_URL;

describe('TEST ENV GET /api/gameHistory', function () {
    it('Should have ACCEPTANCE_URL environment variable exported.', function () {
        // Mocha/Should library is weird
        // jshint -W030
        acceptanceUrl.should.be.ok;
    });

    it('should execute same test using old style', function (done) {
        var command =     {
            id : "1234",
            gameId : "999",
            comm: "CreateGame",
            userName: "Gulli",
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        };

        var req = request(acceptanceUrl);
        req
        .post('/api/createGame')
        .type('json')
        .send(command)
        .end(function (err, res) {
            if (err) return done(err);
            request(acceptanceUrl)
            .get('/api/gameHistory/999')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                should(res.body).eql(
                    [{
                        "id": "1234",
                        "gameId": "999",
                        "event": "GameCreated",
                        "userName": "Gulli",
                        "name": "TheFirstGame",
                        "timeStamp": "2014-12-02T11:29:29"
                }]);
                done();
            });
        });
    });

    it('should execute fluid API test', (done) => {
        given(user("Grimur").createsGame("FirstTTT").command)
        .expect('GameCreated').isOk(done);
    });

    it('should place one move', (done) => {
        given(user("Grimur").createsGame("FirstTTT").withId('2').command)
        .and(user('Katur').joinsGame('FirstTTT').withId('2').command)
        .and(user('Grimur').makesMove(0, 0).withToken('X').withId('2').command)
        .expect('MoveMade').withGameId('2').withUser('Grimur').isOk(done);
    })

    it('play until a player wins', (done) => {
        given(user("Grimur").createsGame("FirstTTT").withId('3').command)
        .and(user('Katur').joinsGame('FirstTTT').withId('3').command)
        .and(user('Grimur').makesMove(0, 0).withToken('X').withId('3').command)
        .and(user('Katur').makesMove(1, 0).withToken('O').withId('3').command)
        .and(user('Grimur').makesMove(0, 1).withToken('X').withId('3').command)
        .and(user('Katur').makesMove(2, 0).withToken('O').withId('3').command)
        .and(user('Grimur').makesMove(0, 2).withToken('X').withId('3').command)
        .expect('GameWon').withGameId('3').withUser('Grimur').isOk(done);
    })

    it('play until there is a draw', (done) => {
        /* 
        X O X
        O O X
        X X O
        */
        given(user("Grimur").createsGame("FirstTTT").withId('4').command)
        .and(user('Katur').joinsGame('FirstTTT').withId('4').command)
        .and(user('Grimur').makesMove(0, 0).withToken('X').withId('4').command)
        .and(user('Katur').makesMove(1, 0).withToken('O').withId('4').command)
        .and(user('Grimur').makesMove(2, 0).withToken('X').withId('4').command)
        .and(user('Katur').makesMove(0, 1).withToken('O').withId('4').command)
        .and(user('Grimur').makesMove(2, 1).withToken('X').withId('4').command)
        .and(user('Katur').makesMove(1, 1).withToken('O').withId('4').command)
        .and(user('Grimur').makesMove(0, 2).withToken('X').withId('4').command)
        .and(user('Katur').makesMove(2, 2).withToken('O').withId('4').command)
        .and(user('Grimur').makesMove(1, 2).withToken('X').withId('4').command)
        .expect('GameDraw').withGameId('4').isOk(done);
    })
});
