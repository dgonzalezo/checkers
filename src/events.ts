import { Player, TileOwner } from "./types";
import { setTile, setTurn, setWinner } from "./UI/state";
import { Board } from "./solucion/board";
import { Tile } from "./solucion/tile";

let turn: Player = "blue";

let board = new Board();
let clickedTiles: Tile[] = [];
/**
 * Called when the user clicks on a tile
 * @param row of the clicked tile
 * @param column of the clicked tile
 * @param owner of the clicked tile
 */
export function onTileClick(row: number, column: number, tileOwner: TileOwner) {
  console.log(`row: ${row} column: ${column} owner: ${tileOwner}`);
  let tile = board.tiles[row][column];
  if (clickedTiles.length !== 0) {
    if (tile.owner === "none") {
      console.log("prueba");
      // let color = tileOwner.split(" ")[0]
      // if (clickedTiles[0].owner.color == turn) {
      let selectTile = clickedTiles[0];
      let [x, y] = selectTile.position;
      console.log(selectTile);
      setTile(x, y, "none");
      let type: TileOwner = selectTile.mapTileOwner();
      setTile(row, column, type);
      tile.owner = selectTile.owner;
      selectTile.owner = "none";
      clickedTiles.pop();
      console.log("pop");
      return;
    } else {
      clickedTiles.pop();
      console.log("pop");
      return;
    }
    // }
  }
  if (tile.owner !== "none" && clickedTiles.length === 0) {
    clickedTiles.push(tile);
    console.log("push");

    console.log(clickedTiles);
    console.log(clickedTiles.length);
  }
}

/**
 * Called when the user clicks on the "restart" button
 */
export function onRestart() {
  board = new Board();
  board.drawBoard();
  // setWinner(undefined);
  // setTurn(undefined);
  // setTile(0, 0, "blue queen");
}
