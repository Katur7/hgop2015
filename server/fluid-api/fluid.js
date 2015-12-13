'use strict';

const should = require('should');
const request = require('supertest');
const acceptanceUrl = process.env.ACCEPTANCE_URL;

function given(_command) {
    let expectedEvent = {
        id: '123',
        gameId: _command.gameId,
        event: undefined,
        userName: _command.userName,
        name: _command.name,
        timeStamp: '2015-12-11T13:12:32.061Z'
    };
    let currentEvent = 0;

    // Store the createGame command
    let commands = [_command];

    let givenApi = {
        withName: (_gameName) => {
            expectedEvent.name = _gameName;
            return givenApi;
        },
        expect: (_eventName) => {
            expectedEvent.event = _eventName;
            return givenApi;
        },
        and: (_command) => {
            givenApi.commands.push(_command);
            return givenApi;
        },
        isOk: (_done) => {
            let req = request(acceptanceUrl);

            new Promise((resolve, reject) => {
                let i = 1;
                for(let command of givenApi.commands) {
                    let url = '/api/' + command.cmd.charAt(0).toLowerCase() + command.cmd.slice(1);
                    req.post(url)
                    .type('json')
                    .send(command)
                    .end((err, res) => {
                        if(err) reject(err);

                        if(i === givenApi.commands.length) {
                            resolve();
                        } else {
                            i++;
                        }
                    });
                }
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

    console.log('CreateGame cmd: ', _command.cmd);
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
            const user = userApi.users[_userName];
            if(!user) throw new Error('User does not exist');

            userApi.command = {
                id : "123",
                gameId : "1",
                comm: "MakeMove",
                userName: user.name,
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
        }
    }
    return userApi;
}

module.exports = {
    given: given,
    user: user
}
