import { Player, TileOwner } from "./types";
import { setTile, setTurn, setWinner } from "./UI/state";
import { Board } from "./solucion/board";
import { Tile } from "./solucion/tile";

let turn: Player = "blue";

let board = new Board();
// let clickedTiles: Tile[] = [];
/**
 * Called when the user clicks on a tile
 * @param row of the clicked tile
 * @param column of the clicked tile
 * @param owner of the clicked tile
 */
export function onTileClick(row: number, column: number, tileOwner: TileOwner) {
  console.log(`row: ${row} column: ${column} owner: ${tileOwner}`);
  board.processClick(row, column, tileOwner)
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
