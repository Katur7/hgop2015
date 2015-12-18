'use strict';

angular.module('tictactoeApp')
  .factory('gameState', function () {
    return function () {

      var gameState = {
        created: false,
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        nextTurn: 'X',
        gameDraw: false,
        winner: undefined,
        mutate: function (events) {
            console.log(events);
          var handlers = {
            'GameCreated': function (event, gameState) {
              gameState.created = true;
              gameState.name = event.name;
              gameState.gameId = event.gameId;
              gameState.creatingUser = event.userName;
            },
            'GameJoined': function (event, gameState) {
              gameState.joiningUser = event.userName;
            },
            'MoveMade': function (event, gameState) {
              var x = event.x, y = event.y;
              gameState.board[x][y] = event.side;
              gameState.nextTurn = event.side === 'X' ? 'O' : 'X';
            },
            'GameWon': function (event, gameState) {
              gameState.nextTurn = 'GameOver';
              gameState.winner = event.userName;
            },
            'GameDraw': function (event, gameState) {
              gameState.nextTurn = 'GameOver';
              gameState.gameDraw = true;
            }
          };
          _.each(events, function (ev) {
            if(!ev) {
              return;
            }
            if(handlers[ev.event]){
              handlers[ev.event](ev, gameState);
            }
          });
        }
      };
      return gameState;
    };
  });
