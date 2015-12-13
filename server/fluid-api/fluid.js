'use strict';

const should = require('should');
const request = require('supertest');
const acceptanceUrl = process.env.ACCEPTANCE_URL;

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
        joinsGame: (_gameName) => {
            userApi.command = {
                id : "124",
                gameId : "1",
                comm: "JoinGame",
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

module.exports = {
    given: given,
    user: user
}
