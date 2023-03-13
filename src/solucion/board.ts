import { Pawn, Queen } from "./pieces";
import { Tile } from "./tile";
import { Owner } from "./types";
import { Player, TileOwner } from "../types";
import { setTurn, setWinner } from "../UI/state";

export class Board {
  public tiles: Tile[][];
  public size: number;
  public clickedTile: Tile[];
  public turn: Player;
  public winner: Player | null;
  public queens: { blue: Tile | null; red: Tile | null } = {
    blue: null,
    red: null,
  };
  constructor(
    public allowMultipleJumps: boolean = false,
    public forceCapture: boolean = false
  ) {
    this.size = 8;
    this.tiles = this.initBoard();
    this.clickedTile = [];
    this.turn = "blue";
    this.winner = null;
    this.queens.blue = this.tiles[0][0];
    this.queens.red = this.tiles[7][7];
  }
  private initBoard(): Tile[][] {
    const board: Tile[][] = [];
    for (let i = 0; i < this.size; i++) {
      let row: Tile[] = [];
      for (let j = 0; j < this.size; j++) {
        let owner: Owner = "none";
        if (i < 3 && (i + j) % 2 === 0) {
          owner = new Pawn("blue", [i, j]);
        } else if (i > 4 && (i + j) % 2 === 0) {
          owner = new Pawn("red", [i, j]);
        }
        const tile = new Tile([i, j], owner);
        row.push(tile);
      }
      board.push(row);
    }
    board[0][0] = new Tile([0, 0], new Queen("blue", [0, 0]));
    board[7][7] = new Tile([7, 7], new Queen("red", [7, 7]));
    return board;
  }

  /**
   * retartGame
   */
  public drawBoard() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let tile = this.tiles[i][j];
        tile.drawPiece();
      }
    }
  }
  /**
   * changeTurn
   */
  public changeTurn() {
    if (this.turn === "red") {
      this.turn = "blue";
      setTurn("blue");
    } else {
      this.turn = "red";
      setTurn("red");
    }
  }
  /**
   * checkWinner
   */
  public checkWinner(tile: Tile) {
    if (tile.owner !== "none" && tile.owner.getType() === "queen") {
      if (tile.owner.color === "blue" && tile.owner.position[0] === 7) {
        setWinner("blue");
        this.winner = "blue";
      }
      if (tile.owner.color === "red" && tile.owner.position[0] === 0) {
        setWinner("red");
        this.winner = "red";
      }
    }
  }
  /**
   * checkSuperPawn
   */
  public checkSuperPawn(tile: Tile) {
    if (tile.owner !== "none" && tile.owner instanceof Pawn) {
      if (
        (tile.owner.color === "blue" && tile.owner.position[0] === 7) ||
        (tile.owner.color === "red" && tile.owner.position[0] === 0)
      ) {
        tile.owner.setsuperPawn();
      }
    }
  }
  /**
   * selectNewQueen
   */
  public selectNewQueen(newTile: Tile) {
    let posibleTiles: Tile[] = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let tile = this.tiles[i][j];
        // Adding only pieces of the same player
        if (tile.owner !== "none" && tile.owner.color === this.turn) {
          if (!!posibleTiles.length) {
            let lastTile = posibleTiles[0];
            // Adding only furthest position from tho opposiet side y has to be < for blue and y has to be > for red
            if (
              (this.turn === "blue" &&
                tile.position[0] < lastTile.position[0]) ||
              (this.turn === "red" && tile.position[0] > lastTile.position[0])
            ) {
              posibleTiles = [tile];
              // Adding pieces with the same distance or in the same row
            } else if (tile.position[0] === lastTile.position[0]) {
              posibleTiles.push(tile);
            }
          } else {
            posibleTiles.push(tile);
          }
        }
      }
    }
    if (!posibleTiles.length) {
      let winner: Player = this.turn === "blue" ? "red" : "blue";
      setWinner(winner);
      this.winner = winner;
      return;
    }
    let change: boolean = posibleTiles.some(
      (tile) =>
        tile.position[0] === newTile.position[0] &&
        tile.position[1] === newTile.position[1]
    );
    if (change) {
      newTile.owner = new Queen(this.turn, newTile.position);
      this.queens[this.turn] = newTile;
      newTile.drawPiece();
      this.checkWinner(newTile);
    } else {
      alert("Select a valid new queen.");
    }
  }
  /**
   * Move Piece
   */

  public processClick(
    row: number,
    column: number,
    tileOwner: TileOwner,
    board: Board
  ) {
    let newTile = this.tiles[row][column];
    if (this.winner) {
      alert("Please restart the game");
      return;
    }
    if (!this.queens.blue || !this.queens.red) {
      this.selectNewQueen(newTile);
      return;
    }
    if (this.clickedTile.length === 0) {
      if (newTile.owner !== "none" && newTile.owner.color === this.turn) {
        this.clickedTile.push(newTile);
        console.log("posible attacks: ");
        console.log(newTile.calculateJumps(board));
        console.log("push");
      }
    } else {
      let selectTile = this.clickedTile[0];
      let canMove = selectTile.Move(newTile, board);
      if (canMove) {
        this.checkWinner(newTile);
        this.checkSuperPawn(newTile);
        this.changeTurn();
      }
      console.log(canMove);

      this.clickedTile.pop();
      console.log("pop");
    }
  }
}
