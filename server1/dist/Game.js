"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const Messages_1 = require("./Messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.start_time = new Date();
        this.player1.send(JSON.stringify({
            type: "init_game",
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: "init_game",
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        // validation here
        // validate the type of move using zod
        // validate user move
        if (this.moves.length % 2 === 0 && socket !== this.player1) {
            console.log("move1");
            return;
        }
        if (this.moves.length % 2 !== 0 && socket !== this.player2) {
            console.log("move2");
            return;
        }
        console.log("move3");
        try {
            this.board.move(move);
            this.moves.push(move);
        }
        catch (error) {
            console.log(error);
            return;
        }
        // Push the move
        // Check if the game is over
        if (this.board.isGameOver()) {
            // send game over message to both players
            this.player1.send(JSON.stringify({
                type: Messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            this.player2.send(JSON.stringify({
                type: Messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            return;
        }
        if (this.board.moves.length % 2 === 0) {
            console.log("in");
            this.player2.send(JSON.stringify({
                type: Messages_1.MOVE,
                payoad: move,
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: Messages_1.MOVE,
                payoad: move,
            }));
        }
        // send the updated board to both players
    }
}
exports.Game = Game;
