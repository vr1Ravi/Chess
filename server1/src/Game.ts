import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, MOVE, MessageType } from "./Messages";
export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  public moves: MessageType[];
  public start_time: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.start_time = new Date();

    this.player1.send(
      JSON.stringify({
        type: "init_game",
        payload: {
          color: "white",
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: "init_game",
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    // validation here
    // validate the type of move using zod

    // validate user move
    if (this.moves.length % 2 === 0 && socket !== this.player1) {
      return;
    }
    if (this.moves.length % 2 !== 0 && socket !== this.player2) {
      return;
    }

    try {
      this.board.move(move);
      this.moves.push(move);
    } catch (error) {
      console.log(error);
      return;
    }

    // Push the move
    // Check if the game is over
    if (this.board.isGameOver()) {
      // send game over message to both players
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );

      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );

      return;
    }

    if (this.board.moves.length % 2 === 0) {
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payoad: move,
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payoad: move,
        })
      );
    }

    // send the updated board to both players
  }
}
