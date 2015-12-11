'use strict';

const should    = require('should');
const request   = require('supertest');
const given     = require('../fluid-api/fluid').given;
const user      = require('../fluid-api/fluid').user;
const acceptanceUrl = process.env.ACCEPTANCE_URL;

const counters = {
    id: 0,
    gameId: 0,
    timeStamp: 1449672646
}

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
/*
    function given(_command) {
        let expectedEvents = [{
            id: '123',
            gameId: '1',
            event: undefined,
            userName: _command.userName,
            name: _command.name,
            timeStamp: '2015-12-11T13:12:32.061Z'
        }];
        let currentEvent = 0;
        let givenApi = {
            withName: (_gameName) => {
                expectedEvents[currentEvent].name = _gameName;
                return givenApi;
            },
            expect: (_eventName) => {
                expectedEvents[currentEvent].event = _eventName;
                return givenApi;
            },
            isOk: (_done) => {
                let req = request(acceptanceUrl);
                req.post('/api/createGame')
                .type('json')
                .send(_command)
                .end((err, res) => {
                    if(err) return _done(err);

                    request(acceptanceUrl)
                    .get('/api/gameHistory/' + _command.gameId)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if(err) return _done(err);

                        // Test logic
                        res.body.should.be.instanceof(Array);
                        res.body.should.eql(expectedEvents);
                        _done();
                    });
                });
                return givenApi;
            }
        };

        return givenApi;
    }

    function user(_userName) {
        const userApi = {
            command: undefined,
            createsGame: (_gameName) => {
                userApi.command = {
                    id : "123",
                    gameId : "1",
                    comm: "CreateGame",
                    userName: _userName,
                    name: _gameName,
                    timeStamp: '2015-12-11T13:12:32.061Z'
                }
                return userApi;
            },
            withId: (_gameId) => {
                userApi.command.gameId = _gameId;
                return userApi;
            }
        }
        return userApi;
    }

*/

    it('Should execute fluid API test', function (done) {
        given(user("Grimur").createsGame("TheFirstGame").command)
        .expect('GameCreated').isOk(done);
    });
});
