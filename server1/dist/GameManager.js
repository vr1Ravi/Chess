"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Messages_1 = require("./Messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user != socket);
        // stop the game here
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            // check
            const message = JSON.parse(data.toString());
            if (message.type === Messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    startGame(this.pendingUser, socket, this.games, this.pendingUser);
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === Messages_1.MOVE) {
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
// start game
function startGame(player1, player2, games, pendingUser) {
    const game = new Game_1.Game(player1, player2);
    games.push(game);
    pendingUser = null;
}
