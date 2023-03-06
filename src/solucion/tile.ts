import { Piece } from "./pieces";
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
  // public canMove() {
  // if (this.owner !== "none") {
  // this.owner.
  // }
  // }
}
