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

    describe('after one move', () => {
        beforeEach(() => {
            given.push({
                id: '125',
                event: 'MoveMade',
                userName: USER1,
                name: GAME_NAME,
                x: 0,
                y: 0,
                side: 'X',
                timeStamp: '2015-12-03T15:13:02.291Z'
            });
        });

        it('should make another move', () => {
            when = {
                id: '126',
                comm: MAKE_MOVE,
                userName: USER2,
                x: 1,
                y: 0,
                side: 'O',
                timeStamp: '2015-12-03T15:13:03.291Z'
            };

            then = [{
                id: '126',
                event: 'MoveMade',
                userName: USER2,
                name: GAME_NAME,
                x: 1,
                y: 0,
                side: 'O',
                timeStamp: '2015-12-03T15:13:03.291Z'
            }];

            const actualEvents = tttCommandHandler(given).executeCommand(when);

            JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));

        });

        it('should forbid making moves in occupied places', () => {
            when = {
                id: '126',
                comm: MAKE_MOVE,
                userName: USER2,
                x: 0,
                y: 0,
                side: 'O',
                timeStamp: '2015-12-03T15:13:03.291Z'
            };

            then = [{
                id: '126',
                event: 'IllegalMove',
                userName: USER2,
                timeStamp: '2015-12-03T15:13:03.291Z'
            }];

            const actualEvents = tttCommandHandler(given).executeCommand(when);

            JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));

        });
    });

    describe('check for winning conditions', () => {
        const constructMoveEvent = (_id, _user, _x, _y) => {
            return {
                id: '12' + _id,
                event: 'MoveMade',
                userName: _user,
                name: GAME_NAME,
                x: _x,
                y: _y,
                side: _user === 'Grimur' ? 'X' : 'O',
                timeStamp: '2015-12-03T15:13:0' + _id + '.291Z' // Unique timestamps
            };
        };

        it('in first row', () => {
            /*
            X X -
            O O -
            - - -
            */
            given.push(constructMoveEvent(5, USER1, 0, 0));
            given.push(constructMoveEvent(6, USER2, 0, 1));
            given.push(constructMoveEvent(7, USER1, 1, 0));
            given.push(constructMoveEvent(8, USER2, 1, 1));

            when = {
                id: '129',
                comm: MAKE_MOVE,
                userName: USER1,
                x: 2,
                y: 0,
                side: 'X',
                timeStamp: '2015-12-03T15:13:09.291Z'
            };

            then = [{
                id: '129',
                event: 'MoveMade',
                userName: USER1,
                name: GAME_NAME,
                x: 2,
                y: 0,
                side: 'X',
                timeStamp: '2015-12-03T15:13:09.291Z'
            }, {
                id: '129',
                event: 'GameWon',
                userName: USER1,
                name: GAME_NAME,
                side: 'X',
                timeStamp: '2015-12-03T15:13:09.291Z'
            }];

            const actualEvents = tttCommandHandler(given).executeCommand(when);

            JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
        });

        it('in second column', () => {
            /*
            O X -
            O X -
            - - -
            */
            given.push(constructMoveEvent(5, USER1, 1, 0));
            given.push(constructMoveEvent(6, USER2, 0, 0));
            given.push(constructMoveEvent(7, USER1, 1, 1));
            given.push(constructMoveEvent(8, USER2, 0, 1));

            when = {
                id: '129',
                comm: MAKE_MOVE,
                userName: USER1,
                x: 1,
                y: 2,
                side: 'X',
                timeStamp: '2015-12-03T15:13:09.291Z'
            };

            then = [{
                id: '129',
                event: 'MoveMade',
                userName: USER1,
                name: GAME_NAME,
                x: 1,
                y: 2,
                side: 'X',
                timeStamp: '2015-12-03T15:13:09.291Z'
            }, {
                id: '129',
                event: 'GameWon',
                userName: USER1,
                name: GAME_NAME,
                side: 'X',
                timeStamp: '2015-12-03T15:13:09.291Z'
            }];

            const actualEvents = tttCommandHandler(given).executeCommand(when);

            JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
        });

        it('in a diagonal line', () => {
            /*
            X O -
            O X -
            - - -
            */
            given.push(constructMoveEvent(5, USER1, 0, 0));
            given.push(constructMoveEvent(6, USER2, 1, 0));
            given.push(constructMoveEvent(7, USER1, 1, 1));
            given.push(constructMoveEvent(8, USER2, 0, 1));

            when = {
                id: '129',
                comm: MAKE_MOVE,
                userName: USER1,
                x: 2,
                y: 2,
                side: 'X',
                timeStamp: '2015-12-03T15:13:09.291Z'
            };

            then = [{
                id: '129',
                event: 'MoveMade',
                userName: USER1,
                name: GAME_NAME,
                x: 2,
                y: 2,
                side: 'X',
                timeStamp: '2015-12-03T15:13:09.291Z'
            }, {
                id: '129',
                event: 'GameWon',
                userName: USER1,
                name: GAME_NAME,
                side: 'X',
                timeStamp: '2015-12-03T15:13:09.291Z'
            }];

            const actualEvents = tttCommandHandler(given).executeCommand(when);

            JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
        });

        it('in a draw', () => {
            /*
            X O X
            O O X
            X X O
            */
            given.push(constructMoveEvent(5, USER1, 0, 0));
            given.push(constructMoveEvent(6, USER2, 1, 0));
            given.push(constructMoveEvent(7, USER1, 2, 0));
            given.push(constructMoveEvent(8, USER2, 0, 1));
            given.push(constructMoveEvent(9, USER1, 2, 1));
            given.push(constructMoveEvent(10, USER2, 1, 1));
            given.push(constructMoveEvent(11, USER1, 0, 2));
            given.push(constructMoveEvent(12, USER2, 2, 2));

            when = {
                id: '130',
                comm: MAKE_MOVE,
                userName: USER1,
                x: 1,
                y: 2,
                side: 'X',
                timeStamp: '2015-12-03T15:13:10.291Z'
            };

            then = [{
                id: '130',
                event: 'MoveMade',
                userName: USER1,
                name: GAME_NAME,
                x: 1,
                y: 2,
                side: 'X',
                timeStamp: '2015-12-03T15:13:10.291Z'
            }, {
                id: '130',
                event: 'GameDraw',
                name: GAME_NAME,
                timeStamp: '2015-12-03T15:13:10.291Z'
            }];

            const actualEvents = tttCommandHandler(given).executeCommand(when);

            JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
        });
    });
})
