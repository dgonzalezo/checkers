import { Color, Position, PieceType } from "./types";
import { Tile } from "./tile";
export abstract class Piece {
  constructor(
    public color: Color,
    public position: Position,
    private type: PieceType
  ) {}
  public abstract canMove(toTile: Tile): boolean;
  public getType(): PieceType {
    return this.type;
  }
}

export class Pawn extends Piece {
  constructor(public color: Color, public position: Position) {
    super(color, position, "pawn");
  }
  canMove(toTile: Tile): boolean {
    const direction: boolean =
      this.color === "blue"
        ? toTile.position[1] < this.position[1]
        : toTile.position[1] > this.position[1];
    if (direction) {
      return false;
    }
    if (toTile.owner !== "none") {
      return false;
    }
    return true;
  }
}

export class Queen extends Piece {
  constructor(public color: Color, public position: Position) {
    super(color, position, "queen");
  }
  canMove(toTile: Tile): boolean {
    return false;
  }
}

// let p1 = new Pawn("blue", [0, 0]);
// let q1 = new Queen("blue", [0, 0]);
// let list: Piece[] = [p1, p1, q1];
// list.map((p) => console.log(p.getType()));
