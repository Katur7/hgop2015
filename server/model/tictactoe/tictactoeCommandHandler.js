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

const isGameOver = (cmd) => {
    const board = gameState.board;
    const player = cmd.side;
    const gameWonEvent = {
        id: cmd.id,
        event: 'GameWon',
        userName: cmd.userName,
        name: gameState.gameCreatedEvent.name,
        side: cmd.side,
        timeStamp: cmd.timeStamp
    };
    const gameDrawEvent = {
        id: cmd.id,
        event: 'GameDraw',
        name: gameState.gameCreatedEvent.name,
        timeStamp: cmd.timeStamp
    };
    let moves = 0;

    for(let i = 0; i < 3; i++) {
        // Check the horizontial lines
        if(board[0][i] === player &&
            board[1][i] === player &&
            board[2][i] === player) {
            return gameWonEvent;
        }
        // Check the vertical lines
        if(board[i][0] === player &&
            board[i][1] === player &&
            board[i][2] === player) {
            return gameWonEvent;
        }

        // Count moves
        for(let j = 0; j < 3; j++) {
            if(board[i][j] !== '') {
                moves++;
            }
        }
    }
    // Check the diagonal lines
    if(board[0][0] === player &&
        board[1][1] === player &&
        board[2][2] === player) {
        return gameWonEvent;
    } else if(board[2][0] === player &&
            board[1][1] === player &&
            board[0][2] === player) {
        return gameWonEvent;
    }

    // Check for draw
    if(moves === 9) {
        return gameDrawEvent;
    }
}

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

            gameState.board[cmd.x][cmd.y] = cmd.side;
            const returnValue = [{
                id: cmd.id,
                event: "MoveMade",
                userName: cmd.userName,
                name: gameState.gameCreatedEvent.name,
                x: cmd.x,
                y: cmd.y,
                side: cmd.side,
                timeStamp: cmd.timeStamp
            }];

            const gameOverEvent = isGameOver(cmd);
            if(gameOverEvent) {
                returnValue.push(gameOverEvent);
            }

            return returnValue;

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
