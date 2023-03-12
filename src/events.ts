import { TileOwner } from "./types";
import { setTurn, setWinner } from "./UI/state";
import { Board } from "./solucion/board";

//start the game
const jumps = document.getElementById("jumps") as HTMLInputElement;
const capture = document.getElementById("capture") as HTMLInputElement;
const allowMultipluJumps = jumps.checked;
const forceCapture = capture.checked;
let board = new Board(allowMultipluJumps, forceCapture);
setTurn(board.turn);
/**
 * Called when the user clicks on a tile
 * @param row of the clicked tile
 * @param column of the clicked tile
 * @param owner of the clicked tile
 */
export function onTileClick(row: number, column: number, tileOwner: TileOwner) {
  console.log(`row: ${row} column: ${column} owner: ${tileOwner}`);
  board.processClick(row, column, tileOwner, board);
}

/**
 * Called when the user clicks on the "restart" button
 */
export function onRestart() {
  const jumps = document.getElementById("jumps") as HTMLInputElement;
  const capture = document.getElementById("capture") as HTMLInputElement;
  const allowMultipluJumps = jumps.checked;
  const forceCapture = capture.checked;
  board = new Board(allowMultipluJumps, forceCapture);
  board.drawBoard();
  setTurn(board.turn);
  setWinner(undefined)
}
