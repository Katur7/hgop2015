'use strict';
const tttCommandHandler = require('./tictactoeCommandHandler');

const CREATEGAME    = 'CreateGame';
const USER1         = 'Grimur';
const USER2         = 'Benni';

describe('join game command', () => {
    let given, when, then;

    it('should join game', () => {
        given = [{
            id: '1234',
            event: 'GameCreated',
            userName: USER1,
            timeStamp: '2015-12-03T15:13:00.291Z'
        }];
        when = {
            id: '1235',
            comm: 'JoinGame',
            userName: USER2,
            name: 'FirstTTT',
            timeStamp: '2015-12-03T15:13:01.291Z'
        };
        then = [{
            id: '1235',
            event: 'GameJoined',
            userName: USER2,
            otherUserName: USER1,
            timeStamp: '2015-12-03T15:13:01.291Z'
        }];
        const actualEvents = tttCommandHandler(given).executeCommand(when);

        JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    })
})
