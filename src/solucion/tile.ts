import { setTile } from "../UI/state";
import { Position, Owner } from "./types";
import { TileOwner } from "../types";
import { Board } from "./board";
import { Pawn } from "./pieces";

export class Tile {
  // to store Tiles which selected Tile can attack in multi jump
  public attackChild: Tile[];
  // to store Tiles parent where child Tile came from in multi jump
  public attackParent: Tile[];

  constructor(public position: Position, public owner: Owner) {
    this.attackChild = [];
    this.attackParent = [];
  }
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
    if (board.forceCapture) {
      let canAttackTiles = this.calculateForceCapture(board);
      if (canAttackTiles.length) {
        let canMoveAttack = canAttackTiles.find(
          (tile) =>
            tile.position[0] === this.position[0] &&
            tile.position[1] === this.position[1]
        );

        // Allow to jupm only in the selected Tile is in the tiles[] with possible attacks
        if (canMoveAttack) {
          let canAttack = false;
          let middleTile = this.calculateMiddle(toTile, board);
          if (board.allowMultipleJumps) {
            let canAttack = this.calculateMultipleJumps(this, toTile, board);

            if (canAttack) {
              let path = this.calculatePath(toTile);
              this.attackMultiJumpDraw(path, board);
            }

            return canAttack;
          } else {
            canAttack = this.owner.canAttack(toTile, middleTile);
          }
          if (canAttack) {
            this.checkAttackQueen(middleTile, board);
            this.attackPieceDraw(toTile, middleTile);
          }
          return canAttack;
        } else {
          return false;
        }
      } else {
        // If there are no tiles with possible attacks just move
        let canMove = this.owner.canMove(toTile);
        if (canMove) {
          this.movePieceDraw(toTile);
        }

        return canMove;
      }
    } else if (diffX === 1 || diffY === 1) {
      // If just doing a simple movement
      let canMove = this.owner.canMove(toTile);
      if (canMove) {
        this.movePieceDraw(toTile);
      }
      return canMove;
    } else if (diffX === 2 && diffY === 2) {
      // If just doing a simple jump
      let middleTile = this.calculateMiddle(toTile, board);
      let canAttack = this.owner.canAttack(toTile, middleTile);
      if (canAttack) {
        this.checkAttackQueen(middleTile, board);
        this.attackPieceDraw(toTile, middleTile);
      }
      return canAttack;
    } else if (board.allowMultipleJumps) {
      let canAttack = this.calculateMultipleJumps(this, toTile, board);

      if (canAttack) {
        let path = this.calculatePath(toTile);
        this.attackMultiJumpDraw(path, board);
      }
      return canAttack;
    } else {
      // if thera are no movements just return false
      return false;
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
    let possibleMovements: Position[] = [
      [this.position[0] + 2, this.position[1] + 2],
      [this.position[0] - 2, this.position[1] - 2],
      [this.position[0] + 2, this.position[1] - 2],
      [this.position[0] - 2, this.position[1] + 2],
    ];
    let possibleAttacks: Tile[] = [];
    for (let i = 0; i < possibleMovements.length; i++) {
      let [x, y] = possibleMovements[i];
      if (x < 8 && x >= 0 && y >= 0 && y < 8) {
        let toTile = board.tiles[x][y];
        let middleTile = this.calculateMiddle(toTile, board);
        if (this.owner !== "none" && this.owner.canAttack(toTile, middleTile)) {
          possibleAttacks.push(board.tiles[x][y]);
        }
      }
    }
    return possibleAttacks;
  }
  /**
   * calculateAttack
   */
  public calculateForceCapture(board: Board): Tile[] {
    let canAttackTiles: Tile[] = [];
    for (let i = 0; i < board.size; i++) {
      for (let j = 0; j < board.size; j++) {
        let tile = board.tiles[i][j];
        if (tile.owner !== "none" && tile.owner.color === board.turn) {
          let possibleAttacks = tile.calculateJumps(board);
          if (possibleAttacks.length) {
            canAttackTiles.push(tile);
          }
        }
      }
    }
    return canAttackTiles;
  }

  // Multi Jump Functionality section
  /**
   * calculateMultipleJumps
   */
  public calculateMultipleJumps(fromTile: Tile, toTile: Tile, board: Board) {
    if (toTile.owner !== "none") {
      return false;
    }
    this.emptyAttacked(board);
    let openTiles: Tile[] = [];
    openTiles.push(fromTile);

    while (openTiles.length ) {
      let tileParent = openTiles.shift()!;
      let jumps = tileParent.possibleMultiJumps(fromTile, board);

      for (let i = 0; i < jumps.length; i++) {
        let childTile = jumps[i];
        if (
          !tileParent.attackChild.some(
            (tile) =>
              tile.position[0] === childTile.position[0] &&
              tile.position[1] === childTile.position[1]
          )
        ) {
          openTiles.push(jumps[i]);
          childTile.attackParent.push(tileParent);
          tileParent.attackChild.push(childTile);
          if (
            !fromTile.attackChild.some(
              (tile) =>
                tile.position[0] === childTile.position[0] &&
                tile.position[1] === childTile.position[1]
            )
          ) {
            // adding all tiles that fromTile can attack to search toTile only in fromTile and not child by child
            fromTile.attackChild.push(childTile);
          }
        }
      }
    }
    if (
      fromTile.attackChild.some(
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
      [this.position[0] + 2, this.position[1] + 2],
      [this.position[0] - 2, this.position[1] - 2],
      [this.position[0] + 2, this.position[1] - 2],
      [this.position[0] - 2, this.position[1] + 2],
    ];
    let possibleAttacks: Tile[] = [];
    for (let i = 0; i < possibleMovements.length; i++) {
      let [x, y] = possibleMovements[i];
      if (x < 8 && x >= 0 && y >= 0 && y < 8) {
        let toTile = board.tiles[x][y];
        let middleTile = this.calculateMiddle(toTile, board);
        if (this.canMultiJump(formTile, toTile, middleTile, board)) {
          possibleAttacks.push(board.tiles[x][y]);
        }
      }
    }

    return possibleAttacks;
  }
  /**
   * canMultiJump
   * Calculating if tile can make a multi jump here because I can't access to Methods
   * canAttack or canMove from Piece class, and it work in a different way
   * in calculate direction I'm using this, which is refered to the parent tile
   */
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
    // using this Tile to get the current node and not the parent node
    // if we use the parent node the direction will be allways correct
    const direction: boolean =
      board.turn === "blue"
        ? toTile.position[0] < this.position[0]
        : toTile.position[0] > this.position[0];

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
    let parent = toTile.attackParent.shift();
    while (parent) {
      path.push(parent);
      parent = parent.attackParent.shift();
    }

    return path;
  }
  /**
   * emptyAttacked
   * Method to empty attackChild and attackParent before every calculateMultipleJumps
   */
  public emptyAttacked(board: Board) {
    for (let i = 0; i < board.size; i++) {
      for (let j = 0; j < board.size; j++) {
        let tile = board.tiles[i][j];
        tile.attackParent = [];
        tile.attackChild = [];
      }
    }
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
      currentTile?.attackPieceDraw(nexTile, middleTile);
    }
  }
}
