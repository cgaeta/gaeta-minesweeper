import { useMemo, useRef } from "react";
import { Cell } from "./Cell";
import { Settings } from "./Settings";
import { useSettings, useGameState } from "../hooks";
import { createNewBoard } from "../utils";

export const BoardGrid = ({}) => {
  const { settings } = useSettings();
  const { gameStarted, clickedCells } = useGameState();

  const mineMapRef = useRef<Set<number>>();
  const mineMap = useMemo(() => {
    if (gameStarted) {
      if (clickedCells.size === 1) {
        const firstClick = clickedCells.values().next().value;
        if (isNaN(firstClick)) throw new Error("Invalid indices!");

        let board = mineMapRef.current;
        if (!board) throw new Error("Board not initialized on first click!");

        let newMineIdx;
        do {
          newMineIdx = Math.floor(
            Math.random() * settings.width * settings.height
          );
        } while (newMineIdx === firstClick || board.has(newMineIdx));

        board.delete(firstClick);
        board.add(newMineIdx);

        mineMapRef.current = new Set(board);
        return mineMapRef.current;
      } else if (clickedCells.size === 0) {
        mineMapRef.current = createNewBoard(settings);
        return mineMapRef.current;
      }

      if (!mineMapRef.current)
        throw new Error("Game board not initialized after first click!");
      return mineMapRef.current;
    }

    return new Set<number>();
  }, [settings, gameStarted, clickedCells]);

  const arr = new Array(settings.height)
    .fill(0)
    .map(() => new Array(settings.width).fill(0));

  return gameStarted ? (
    <table>
      <tbody>
        {arr.map((row, i) => (
          <tr key={i}>
            {row.map((_c, j) => (
              <td key={j}>
                <Cell mineMap={mineMap} idx={i * settings.height + j} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <Settings />
  );
};
