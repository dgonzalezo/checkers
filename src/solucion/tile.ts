import { setTile, setTurn, setWinner } from "../UI/state";
import { Position, Owner } from "./types";
import { TileOwner } from "../types";

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
  public Move(toTile: Tile, tiles: Tile[][]): boolean {
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
      let middleTile = tiles[middleX][middleY];
      let canAttack = this.owner.canAttack(toTile, middleTile);
      if (canAttack) {
        console.log("attack");
        
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
      let [x, y] = this.position;
      let [to_x, to_y] = toTile.position;
      this.owner.position = [to_x, to_y];
      toTile.owner = this.owner;
      let type: TileOwner = this.mapTileOwner();
      setTile(to_x, to_y, type);
      this.owner = "none";
      setTile(x, y, "none");
    }
  }
  public attackPieceDraw(toTile: Tile, middleTile: Tile) {
    if (this.owner !== "none") {
      let [x, y] = this.position;
      let [to_x, to_y] = toTile.position;
      let [m_x, m_y] = middleTile.position;
      this.owner.position = [to_x, to_y];
      toTile.owner = this.owner;
      let type: TileOwner = this.mapTileOwner();
      setTile(to_x, to_y, type);
      this.owner = "none";
      middleTile.owner = "none";
      setTile(x, y, "none");
      setTile(m_x, m_y, "none");
    }
  }
}
