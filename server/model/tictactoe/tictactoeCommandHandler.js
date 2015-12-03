'use strict';
let gameCreatedEvent = [];

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
        console.log(gameCreatedEvent);
            return [{
                id: cmd.id,
                event: 'GameJoined',
                userName: cmd.userName,
                otherUserName: gameCreatedEvent[0].userName,
                timeStamp: cmd.timeStamp
            }];

        default:
            return 'No handler found';
    }
}

module.exports = (events) => {
    gameCreatedEvent = events;

    return {
        executeCommand: executeCommand
    }
};
