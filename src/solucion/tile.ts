import { setTile} from "../UI/state";
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
    if (diffX > 1 && diffY > 1) {
      const middleX = x < to_x ? x + 1 : x - 1;
      const middleY = y < to_y ? y + 1 : y - 1;
      let middleTile = board.tiles[middleX][middleY];
      let canAttack = this.owner.canAttack(toTile, middleTile);
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
  }
  /**
   * movePiece
   */
  public movePieceDraw(toTile: Tile) {
    if (this.owner !== "none") {
      let [to_x, to_y] = toTile.position;
      this.owner.position = [to_x, to_y];
      toTile.owner = this.owner;
      toTile.drawPiece()
      this.owner = "none";
      this.drawPiece()
    }
  }
  public attackPieceDraw(toTile: Tile, middleTile: Tile) {
    if (this.owner !== "none") {
      let [to_x, to_y] = toTile.position;
      this.owner.position = [to_x, to_y];
      toTile.owner = this.owner;
      toTile.drawPiece()
      this.owner = "none";
      this.drawPiece()
      middleTile.owner = "none";
      middleTile.drawPiece()
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
}
