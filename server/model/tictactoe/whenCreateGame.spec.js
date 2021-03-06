'use strict';
const tttCommandHandler = require('./tictactoeCommandHandler');

const CREATEGAME    = 'CreateGame';
const USER1         = 'Grimur';
const USER2         = 'Benni';

describe('create game command', () => {
    let given, when, then;

    it('should create game', () => {
        given = [];
        when = {
            id: '123',
            comm: CREATEGAME,
            gameId: '1',
            userName: USER1,
            name: 'FirstTTT',
            timeStamp: '2015-12-03T15:13:01.291Z'
        };
        then = [{
            id: '123',
            event: 'GameCreated',
            gameId: '1',
            name: 'FirstTTT',
            userName: USER1,
            timeStamp: '2015-12-03T15:13:01.291Z'
        }];

        const actualEvents = tttCommandHandler(given).executeCommand(when);

        JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });

    it('should create game with another user and timeStamp', () => {
        given = [];
        when = {
            id: '1234',
            comm: CREATEGAME,
            gameId: '2',
            userName: USER2,
            name: 'FirstTTT',
            timeStamp: '2015-12-03T15:13:00.291Z'
        };
        then = [{
            id: '1234',
            event: 'GameCreated',
            gameId: '2',
            name: 'FirstTTT',
            userName: USER2,
            timeStamp: '2015-12-03T15:13:00.291Z'
        }];

        const actualEvents = tttCommandHandler(given).executeCommand(when);

        JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });

});
