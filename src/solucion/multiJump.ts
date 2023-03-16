import { Tile } from "./tile";
import { Board } from "./board";
import { Pawn } from "./pieces";
import { Position } from "./types";
export class MultiJupm {
  public child: Tile[];
  public parent: Tile[];
  constructor(public owner: Tile) {
    this.child = [];
    this.parent = [];
  }

  public calculateMultipleJumps(fromTile: Tile, toTile: Tile, board: Board) {
    if (toTile.owner !== "none") {
      return false;
    }
    let openTiles: Tile[] = [];
    openTiles.push(fromTile);

    while (openTiles.length) {
      let tileParent = openTiles.shift()!;
      let jumps = tileParent.multiJump!.possibleMultiJumps(fromTile, board);

      for (let i = 0; i < jumps.length; i++) {
        let childTile = jumps[i];
        if (
          !tileParent.multiJump!.child.some(
            (tile) =>
              tile.position[0] === childTile.position[0] &&
              tile.position[1] === childTile.position[1]
          )
        ) {
          // creating a new multiJump only if not exist in fromTile child
          // if not verify and tow multi path goes to the same final tile
          // it will create a new MultiJupm() and the last information will be deleted
          if (
            !fromTile.multiJump!.child.some(
              (tile) =>
                tile.position[0] === childTile.position[0] &&
                tile.position[1] === childTile.position[1]
            )
          ) {
            // adding all tiles that fromTile can attack to search toTile only in fromTile and not child by child
            fromTile.multiJump!.child.push(childTile);
            childTile.multiJump = new MultiJupm(childTile);
          }
          openTiles.push(jumps[i]);

          childTile.multiJump!.parent.push(tileParent);

          tileParent.multiJump!.child.push(childTile);
        }
      }
    }
    if (
      fromTile.multiJump!.child.some(
        (tile) =>
          tile.position[0] === toTile.position[0] &&
          tile.position[1] === toTile.position[1]
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
  public possibleMultiJumps(formTile: Tile, board: Board) {
    let possibleMovements: Position[] = [
      [this.owner.position[0] + 2, this.owner.position[1] + 2],
      [this.owner.position[0] - 2, this.owner.position[1] - 2],
      [this.owner.position[0] + 2, this.owner.position[1] - 2],
      [this.owner.position[0] - 2, this.owner.position[1] + 2],
    ];
    let possibleAttacks: Tile[] = [];
    for (let i = 0; i < possibleMovements.length; i++) {
      let [x, y] = possibleMovements[i];
      if (x < 8 && x >= 0 && y >= 0 && y < 8) {
        let toTile = board.tiles[x][y];
        let middleTile = this.owner.calculateMiddle(toTile, board);
        if (
          this.owner.multiJump!.canMultiJump(
            formTile,
            toTile,
            middleTile,
            board
          )
        ) {
          possibleAttacks.push(board.tiles[x][y]);
        }
      }
    }

    return possibleAttacks;
  }

  public canMultiJump(
    fromTile: Tile,
    toTile: Tile,
    middleTile: Tile,
    board: Board
  ) {
    const [to_x, to_y] = toTile.position;
    let parent: Tile = fromTile;

    if (to_x > 7 || to_x < 0 || to_y < 0 || to_y > 7) {
      return false;
    }
    if (toTile.owner !== "none") {
      return false;
    }
    //verifying if toTile is parent tile to avoid going back the same way
    if (
      this.owner.multiJump?.parent.some(
        (tile) =>
          tile.position[0] === toTile.position[0] &&
          tile.position[1] === toTile.position[1]
      )
    ) {
      return false;
    }
    // using this Tile to get the current node and not the parent node
    // if we use the parent node the direction will be allways correct
    const direction: boolean =
      board.turn === "blue"
        ? toTile.position[0] < this.owner.position[0]
        : toTile.position[0] > this.owner.position[0];

    // check direction only if is pawn with super Pawn false
    if (
      parent.owner !== "none" &&
      parent.owner instanceof Pawn &&
      !parent.owner.getsuperPawn() &&
      direction
    ) {
      return false;
    }

    if (middleTile.owner === "none") {
      return false;
    }
    if (middleTile.owner.color === board.turn) {
      return false;
    }
    return true;
  }

  /**
   * calculatePath
   */
  public calculatePath(toTile: Tile): Tile[] {
    // getting parent with shift() to get the first parent added
    let path: Tile[] = [];
    path.push(toTile);
    let parent = toTile.multiJump!.parent.shift();
    while (parent) {
      path.push(parent);
      parent = parent.multiJump!.parent.shift();
    }

    return path;
  }

  /**
   * attackMultiJumpDraw
   */
  public attackMultiJumpDraw(path: Tile[], board: Board) {
    let openPath = path;
    while (openPath.length - 1) {
      let currentTile = openPath.pop();
      let nexTile = openPath[openPath.length - 1];
      let middleTile = currentTile!.calculateMiddle(nexTile, board);
      this.owner.checkAttackQueen(middleTile, board);
      currentTile?.attackPieceDraw(nexTile, middleTile);
    }
  }
}
