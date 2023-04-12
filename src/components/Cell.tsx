import { useMemo } from "react";

const getProximateCells = (gameBoard: string[][], i: number, j: number) =>
  gameBoard
    .slice(Math.max(0, i - 1), Math.min(gameBoard.length + 1, i + 2))
    .map((row) =>
      row.slice(Math.max(0, j - 1), Math.min(row.length + 1, j + 2))
    );

const collectProximateEmptyCells = (
  gameBoard: string[][],
  i: number,
  j: number,
  clickedCells: Set<string>
) => {
  clickedCells.add(`${i}-${j}`);

  if (
    getProximateCells(gameBoard, i, j)
      .flat()
      .every((c) => c !== "!")
  ) {
    for (
      let y = Math.max(0, i - 1);
      y < Math.min(i + 2, gameBoard.length);
      y++
    ) {
      for (
        let x = Math.max(0, j - 1);
        x < Math.min(j + 2, gameBoard[i].length);
        x++
      ) {
        if (!clickedCells.has(`${y}-${x}`)) {
          collectProximateEmptyCells(gameBoard, y, x, clickedCells);
        }
      }
    }
  }

  return clickedCells;
};

const CellNumber = ({ number }: { number: number }) => {
  if (number === 0) {
    return null;
  }

  if (number === 1) {
    return <span className="font-semibold text-blue-800">1</span>;
  }

  if (number === 2) {
    return <span className="font-semibold text-green-700">2</span>;
  }

  if (number === 3) {
    return <span className="font-semibold text-red-600">3</span>;
  }

  if (number === 4) {
    return <span className="font-semibold text-indigo-900">4</span>;
  }

  if (number === 5) {
    return <span className="font-semibold text-yellow-900">5</span>;
  }

  if (number === 6) {
    return <span className="font-semibold text-green-700">6</span>;
  }

  if (number === 7) {
    return <span className="font-semibold text-gray-800">7</span>;
  }

  if (number === 8) {
    return <span className="font-semibold text-gray-700">8</span>;
  }

  return null;
};

export const Cell = ({
  gameBoard,
  clickedCells,
  setClickedCells,
  flaggedCells,
  setFlaggedCells,
  gameLost,
  setGameLost,
  i,
  j,
}: {
  gameBoard: string[][];
  clickedCells: Set<string>;
  setClickedCells: (set: Set<string>) => void;
  flaggedCells: Set<string>;
  setFlaggedCells: (set: Set<string>) => void;
  gameLost: boolean;
  setGameLost: (lost: boolean) => void;
  i: number;
  j: number;
}) => {
  const clicked = clickedCells.has(`${i}-${j}`);
  const flagged = flaggedCells.has(`${i}-${j}`);
  const isMine = gameBoard[i][j] === "!";
  const proximateMines = useMemo(() => {
    return gameBoard
      .slice(Math.max(0, i - 1), Math.min(gameBoard.length + 1, i + 2))
      .map((row) =>
        row.slice(Math.max(0, j - 1), Math.min(row.length + 1, j + 2))
      );
  }, [gameBoard, i, j]);

  if (clicked)
    return isMine ? (
      <button className="block border-box p-0 w-8 h-8 bg-red-600">
        &#128163;
      </button>
    ) : (
      <button className="block text-base border-box p-0 text-sm w-8 h-8 bg-gray-400">
        <CellNumber
          number={proximateMines.flat().filter((c) => c === "!").length}
        />
      </button>
    );

  return (
    <button
      className="block border-box p-0 text-sm w-8 h-8 border-4 bg-gray-400 border-gray-200 border-r-gray-600 border-b-gray-600"
      onClick={() => {
        setClickedCells(
          new Set(collectProximateEmptyCells(gameBoard, i, j, clickedCells))
        );
        if (isMine) {
          setGameLost(true);
        }
      }}
      onContextMenu={() => {
        setFlaggedCells(new Set(flaggedCells.add(`${i}-${j}`)));
        return false;
      }}
      disabled={gameLost}
    >
      {flagged ? <span>&#128681;</span> : null}
    </button>
  );
};
