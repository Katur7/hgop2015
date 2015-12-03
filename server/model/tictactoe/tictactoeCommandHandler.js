'use strict';
let gameCreatedEvent = {};

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
            break;

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
