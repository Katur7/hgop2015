'use strict';
const gameState = {

};

const resetGameState = () => {
    gameState.gameCreatedEvent =  undefined;
    gameState.gameJoinedEvent =  undefined;
    gameState.board =   [['', '', ''],
                         ['', '', ''],
                         ['', '', '']];
};

const initialize = (events) => {
    resetGameState();
    for(const e of events) {
        switch (e.event) {
            case 'GameCreated':
                gameState.gameCreatedEvent = e;
                break;
            case 'GameJoined':
                gameState.gameJoinedEvent = e;
                break;
            case 'MoveMade':
                gameState.board[e.x][e.y] = e.side;
                break;
            default:
                throw new Error('Event not found');
        }
    }
};

const constructError = (cmd, eventMessage) => {
    return [{
        id: cmd.id,
        event: eventMessage,
        userName: cmd.userName,
        timeStamp: cmd.timeStamp
    }];
}

const executeCommand = (cmd) => {
    switch (cmd.comm) {
        case 'CreateGame':
            return [{
                id: cmd.id,
                event: 'GameCreated',
                userName: cmd.userName,
                timeStamp: cmd.timeStamp
            }];

        case 'JoinGame':
            if(gameState.gameCreatedEvent === undefined) {
                return constructError(cmd, 'GameDoesNotExist');
            }

            return [{
                id: cmd.id,
                event: 'GameJoined',
                userName: cmd.userName,
                otherUserName: gameState.gameCreatedEvent.userName,
                timeStamp: cmd.timeStamp
            }];

        case 'MakeMove':
            if(gameState.gameCreatedEvent === undefined) {
                return constructError(cmd, 'GameDoesNotExist');
            } else if(gameState.gameJoinedEvent === undefined) {
                return constructError(cmd, 'GameHasOnlyOneUser');
            } else if(gameState.board[cmd.x][cmd.y] !== '') {
                return constructError(cmd, 'IllegalMove');
            }

            return [{
                id: cmd.id,
                event: "MoveMade",
                userName: cmd.userName,
                name: gameState.gameCreatedEvent.name,
                x: cmd.x,
                y: cmd.y,
                side: cmd.side,
                timeStamp: cmd.timeStamp
            }];

        default:
            return 'No handler found';
    }
}

module.exports = (events) => {
    initialize(events);

    return {
        executeCommand: executeCommand
    }
};
