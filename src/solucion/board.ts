import { Pawn, Queen } from "./pieces";
import { Tile } from "./tile";
import { Owner } from "./types";
import { Player, TileOwner } from "../types";
import { setTile } from "../UI/state";

export class Board {
  public tiles: Tile[][];
  private boardSize: number;
  public clickedTile: Tile[];
  public turn: Player;
  constructor() {
    this.boardSize = 8;
    this.tiles = this.initBoard();
    this.clickedTile = [];
    this.turn = "blue";
  }
  private initBoard(): Tile[][] {
    const board: Tile[][] = [];
    for (let i = 0; i < this.boardSize; i++) {
      let row: Tile[] = [];
      for (let j = 0; j < this.boardSize; j++) {
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
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let tile = this.tiles[i][j];
        let [x, y] = tile.position;
        let type: TileOwner = tile.mapTileOwner();
        setTile(x, y, type);
      }
    }
  }
  /**
   * Move Piece
   */

  public processClick(row: number, column: number, tileOwner: TileOwner) {
    let newTile = this.tiles[row][column];
    console.log(newTile);
    if (this.clickedTile.length === 0) {
      if (newTile.owner !== "none") {
        this.clickedTile.push(newTile);
        console.log("push");
        
      }
    } else {
      let selectTile = this.clickedTile[0];
      let canMove = selectTile.Move(newTile, this.tiles)
      console.log(canMove);
      
      this.clickedTile.pop();
      console.log("pop");
    }
  }
}
