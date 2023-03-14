import { Color, Position, PieceType } from "./types";
import { Tile } from "./tile";
export abstract class Piece {
  constructor(
    public color: Color,
    public position: Position,
    private type: PieceType
  ) {}
  public abstract canMove(toTile: Tile): boolean;
  public abstract canAttack(toTile: Tile, middleTiles: Tile): boolean;
  public getType(): PieceType {
    return this.type;
  }
}

export class Pawn extends Piece {
  constructor(
    public color: Color,
    public position: Position,
    private superPawn = false
  ) {
    super(color, position, "pawn");
  }
  canMove(toTile: Tile): boolean {
    const [x, y] = this.position;
    const [to_x, to_y] = toTile.position;
    const diffx = Math.abs(x - to_x);
    const diffy = Math.abs(y - to_y);
    if (to_x > 7 || to_x < 0 || to_y < 0 || to_y > 7) {
      return false;
    }
    if (toTile.owner !== "none") {
      return false;
    }
    // if next position is lower than current position is true so it is a worng move for blue
    // and otherwies for red
    const direction: boolean =
      this.color === "blue"
        ? toTile.position[0] < this.position[0]
        : toTile.position[0] > this.position[0];
    if (direction && !this.superPawn) {
      return false;
    }
    if (x === to_x || y === to_y) {
      return false;
    }
    if (diffx !== diffy) {
      return false;
    }
    return true;
  }
  canAttack(toTile: Tile, middleTile: Tile): boolean {
    if (!this.canMove(toTile)) {
      return false;
    }
    if (middleTile.owner === "none") {
      return false;
    }
    if (middleTile.owner.color === this.color) {
      return false;
    }
    return true;
  }
  public setsuperPawn() {
    this.superPawn = true;
  }
  public getsuperPawn() {
    return this.superPawn;
  }
}

export class Queen extends Piece {
  constructor(public color: Color, public position: Position) {
    super(color, position, "queen");
  }
  canMove(toTile: Tile): boolean {
    const [x, y] = this.position;
    const [to_x, to_y] = toTile.position;
    const diffx = Math.abs(x - to_x);
    const diffy = Math.abs(y - to_y);
    if (to_x > 7 || to_x < 0 || to_y < 0 || to_y > 7) {
      return false;
    }
    if (toTile.owner !== "none") {
      return false;
    }
    if (x === to_x || y === to_y) {
      return false;
    }
    if (diffx !== diffy) {
      return false;
    }
    return true;
  }

  canAttack(toTile: Tile, middleTile: Tile): boolean {
    if (!this.canMove(toTile)) {
      return false;
    }
    if (middleTile.owner === "none") {
      return false;
    }
    if (middleTile.owner.color === this.color) {
      return false;
    }
    return true;
  }
}
