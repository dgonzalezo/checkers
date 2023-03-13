import { setTile } from "../UI/state";
import { Position, Owner } from "./types";
import { TileOwner } from "../types";
import { Board } from "./board";

export class Tile {
  constructor(public position: Position, public owner: Owner) {}
  public mapTileOwner() {
    let type: TileOwner =
      this.owner !== "none"
        ? this.owner.color === "blue"
          ? this.owner.getType() === "queen"
            ? "blue queen"
            : "blue pawn"
          : this.owner.getType() === "queen"
          ? "red queen"
          : "red pawn"
        : "none";
    return type;
  }
  /**
   * canMove
   */
  public Move(toTile: Tile, board: Board): boolean {
    if (this.owner === "none") {
      return false;
    }
    let [x, y] = this.owner.position;
    let [to_x, to_y] = toTile.position;
    let diffX = Math.abs(x - to_x);
    let diffY = Math.abs(y - to_y);
    if (board.forceCapture || (diffX > 1 && diffY > 1)) {
      let canAttackTiles = this.calculateAttack(board);
      if (canAttackTiles.length) {
        let canMoveAttack = canAttackTiles.some(
          (tile) =>
            tile.position[0] === this.position[0] &&
            tile.position[1] === this.position[1]
        );
        let middleTile = this.calculateMiddle(toTile, board);
        let canAttack = canMoveAttack
          ? this.owner.canAttack(toTile, middleTile)
          : false;
        if (canAttack) {
          console.log("attack");
          this.checkAttackQueen(middleTile, board);
          this.attackPieceDraw(toTile, middleTile);
        }
        return canAttack;
      } else {
        let canMove = this.owner.canMove(toTile);
        if (canMove) {
          console.log("move");
          this.movePieceDraw(toTile);
        }

        return canMove;
      }
    } else {
      let canMove = this.owner.canMove(toTile);
      if (canMove) {
        console.log("move");
        this.movePieceDraw(toTile);
      }

      return canMove;
    }
  }
  /**
   * calculateMiddle (Piece)
   */
  public calculateMiddle(toTile: Tile, board: Board): Tile {
    let [x, y] = this.position;
    let [to_x, to_y] = toTile.position;
    const middleX = x < to_x ? x + 1 : x - 1;
    const middleY = y < to_y ? y + 1 : y - 1;
    let middleTile = board.tiles[middleX][middleY];
    return middleTile;
  }
  /**
   * movePiece
   */
  public movePieceDraw(toTile: Tile) {
    if (this.owner !== "none") {
      let [to_x, to_y] = toTile.position;
      this.owner.position = [to_x, to_y];
      toTile.owner = this.owner;
      toTile.drawPiece();
      this.owner = "none";
      this.drawPiece();
    }
  }
  public attackPieceDraw(toTile: Tile, middleTile: Tile) {
    if (this.owner !== "none") {
      let [to_x, to_y] = toTile.position;
      this.owner.position = [to_x, to_y];
      toTile.owner = this.owner;
      toTile.drawPiece();
      this.owner = "none";
      this.drawPiece();
      middleTile.owner = "none";
      middleTile.drawPiece();
    }
  }
  /**
   * drawPiece
   */
  public drawPiece() {
    let [x, y] = this.position;
    let type: TileOwner = this.mapTileOwner();
    setTile(x, y, type);
  }
  /**
   * deleteQueen
   */
  public checkAttackQueen(middleTile: Tile, board: Board) {
    if (middleTile.owner !== "none" && middleTile.owner.getType() === "queen") {
      board.queens[middleTile.owner.color] = null;
    }
  }
  /**
   * calculateJumps
   */
  public calculateJumps(board: Board) {
    let posibleMovements: Position[] = [
      [this.position[0] + 2, this.position[1] + 2],
      [this.position[0] - 2, this.position[1] - 2],
      [this.position[0] + 2, this.position[1] - 2],
      [this.position[0] - 2, this.position[1] + 2],
    ];
    let posibleAttacks: Tile[] = [];
    for (let i = 0; i < posibleMovements.length; i++) {
      let [x, y] = posibleMovements[i];
      if (x < 8 && x >= 0 && y >= 0 && y < 8) {
        let toTile = board.tiles[x][y];
        let middleTile = this.calculateMiddle(toTile, board);
        if (this.owner !== "none" && this.owner.canAttack(toTile, middleTile)) {
          posibleAttacks.push(board.tiles[x][y]);
        }
      }
    }
    return posibleAttacks;
  }
  /**
   * calculateAttack
   */
  public calculateAttack(board: Board): Tile[] {
    let canAttackTiles: Tile[] = [];
    if (board.forceCapture) {
      for (let i = 0; i < board.size; i++) {
        for (let j = 0; j < board.size; j++) {
          let tile = board.tiles[i][j];
          if (tile.owner !== "none" && tile.owner.color === board.turn) {
            let posibleAttacks = tile.calculateJumps(board);
            if (posibleAttacks.length) {
              canAttackTiles.push(tile);
            }
          }
        }
      }
    } else {
      let posibleAttacks = this.calculateJumps(board);
      if (posibleAttacks.length) {
        canAttackTiles.push(this);
      }
    }
    return canAttackTiles;
  }
}
