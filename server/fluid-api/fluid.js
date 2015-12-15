'use strict';

const should = require('should');
const request = require('supertest');
const acceptanceUrl = process.env.ACCEPTANCE_URL;

function commandToURL(_cmd) {
    switch(_cmd) {
        case 'CreateGame':
            return 'createGame'
        case 'JoinGame':
            return 'joinGame'
        case 'MakeMove':
            return 'placeMove'
    }
}

function sendCommands(commands, pos, gameId, resolve, reject) {
    let url = '/api/' + commandToURL(commands[pos].comm);
    request(acceptanceUrl).post(url)
    .type('json')
    .send(commands[pos])
    .end((err, res) => {
        if(err) reject(err);

        console.log('Sending command: %s, number: %d', commands[pos], pos);
        if(pos === commands.length - 1) {
            return resolve();
        } else {
            sendCommands(commands, ++pos, gameId, resolve, reject);
        }
    });
}

function given(_command) {
    let possibleEvents = {
        'GameCreated': {
            id: '123',
            event: 'GameCreated',
            gameId: '1',
            name: 'FirstTTT',
            userName: 'Grimur',
            timeStamp: '2015-12-11T13:12:32.061Z'
        },
        'GameJoined': {
            id: '123',
            gameId: '1',
            event: 'GameJoined',
            userName: 'Katur',
            otherUserName: 'Grimur',
            timeStamp: '2015-12-11T13:12:32.061Z'
        },
        'MoveMade': {
            id: '123',
            gameId: '1',
            event: 'MoveMade',
            userName: 'Grimur',
            name: 'FirstTTT',
            x: 0,
            y: 0,
            side: 'X',
            timeStamp: '2015-12-11T13:12:32.061Z'
        },
        'GameDraw': {
            id: '123',
            gameId: '1',
            event: 'GameDraw',
            name: 'FirstTTT',
            timeStamp: '2015-12-11T13:12:32.061Z'
        },
        'GameWon': {
            id: '123',
            gameId: '1',
            event: 'GameWon',
            userName: 'Grimur',
            name: 'FirstTTT',
            side: 'X',
            timeStamp: '2015-12-11T13:12:32.061Z'
        }
    }
    let expectedEvent = {};
    //let currentEvent = 0;

    // Store the createGame command
    let commands = [_command];

    let givenApi = {
        withName: (_gameName) => {
            expectedEvent.name = _gameName;
            return givenApi;
        },
        withGameId: (_gameId) => {
            expectedEvent.gameId = _gameId;
            return givenApi;
        },
        withUser: (_userName) => {
            expectedEvent.userName = _userName;
            return givenApi;
        },
        expect: (_eventName) => {
            expectedEvent = possibleEvents[_eventName];
            return givenApi;
        },
        and: (_command) => {
            commands.push(_command);
            return givenApi;
        },
        isOk: (_done) => {
            new Promise((resolve, reject) => {
                sendCommands(commands, 0, _command.gameId, resolve, reject);
            })
            .then(() => {
                request(acceptanceUrl)
                .get('/api/gameHistory/' + _command.gameId)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if(err) return _done(err);

                    // Test logic
                    res.body.should.be.instanceof(Array);
                    res.body[res.body.length - 1].should.eql(expectedEvent);
                    _done();
                });
            })
            .catch((err) => {
                _done(err)
            });

            return givenApi;
        }
    };

    return givenApi;
}

function user(_userName) {
    const userApi = {
        command: undefined,
        users: {},
        createsGame: (_gameName) => {
            userApi.users[_userName] = {
                name: _userName,
                side: 'X'
            };
            userApi.command = {
                id : "123",
                gameId : "1",
                comm: "CreateGame",
                userName: _userName,
                name: _gameName,
                timeStamp: '2015-12-11T13:12:32.061Z'
            };
            return userApi;
        },
        joinsGame: (_gameName) => {
            userApi.users[_userName] = {
                name: _userName,
                side: 'O'
            };
            userApi.command = {
                id : "123",
                gameId : "1",
                comm: "JoinGame",
                userName: _userName,
                name: _gameName,
                timeStamp: '2015-12-11T13:12:32.061Z'
            }
            return userApi;
        },
        makesMove: (_x, _y) => {
            userApi.command = {
                id : "123",
                gameId : "1",
                comm: "MakeMove",
                userName: _userName,
                x: _x,
                y: _y,
                side: user.side,
                timeStamp: '2015-12-11T13:12:32.061Z'
            }
            return userApi;
        },
        withId: (_gameId) => {
            userApi.command.gameId = _gameId;
            return userApi;
        },
        withToken: (_side) => {
            userApi.command.side = _side;
            return userApi;
        }
    }
    return userApi;
}

module.exports = {
    given: given,
    user: user
}
