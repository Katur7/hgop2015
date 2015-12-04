'use strict';
const tttCommandHandler = require('./tictactoeCommandHandler');

const CREATE_GAME    = 'CreateGame';
const MAKE_MOVE      = 'MakeMove';
const GAME_NAME     = 'FirstTTT';
const USER1         = 'Grimur';
const USER2         = 'Benni';

describe('make move command', () => {
    let given, when, then;

    beforeEach(() => {
        given = [{
            id: '123',
            event: 'GameCreated',
            name: GAME_NAME,
            userName: USER1,
            timeStamp: '2015-12-03T15:13:00.291Z'
        }, {
            id: '124',
            event: 'GameJoined',
            userName: USER2,
            otherUserName: USER1,
            timeStamp: '2015-12-03T15:13:01.291Z'
        }]
    });

    it('should make first move', () => {
        when = {
            id: '125',
            comm: MAKE_MOVE,
            userName: USER1,
            x: 0,
            y: 0,
            side: 'X',
            timeStamp: '2015-12-03T15:13:02.291Z'
        };

        then = [{
            id: '125',
            event: 'MoveMade',
            userName: USER1,
            name: GAME_NAME,
            x: 0,
            y: 0,
            side: 'X',
            timeStamp: '2015-12-03T15:13:02.291Z'
        }];

        const actualEvents = tttCommandHandler(given).executeCommand(when);

        JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });
})
