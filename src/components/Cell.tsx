import { useMemo } from "react";
import { useGameState, useSettings } from "../hooks";

const getProximateCells = (idx: number, w: number, h: number) => {
  const y = Math.floor(idx / w);
  const x = idx % w;
  let cells: number[] = [];

  for (let i = Math.max(y - 1, 0); i < Math.min(y + 2, h); i++) {
    for (let j = Math.max(x - 1, 0); j < Math.min(x + 2, w); j++) {
      cells.push(i * w + j);
    }
  }

  return cells;
};

const collectProximateEmptyCells = (
  mineMap: Set<number>,
  idx: number,
  width: number,
  height: number,
  clickedCells: Set<number>
) => {
  clickedCells.add(idx);
  const proximateCells = getProximateCells(idx, width, height);

  if (proximateCells.every((c) => !mineMap.has(c))) {
    proximateCells
      .filter((c) => !clickedCells.has(c))
      .forEach((c) => {
        collectProximateEmptyCells(mineMap, c, width, height, clickedCells);
      });
  }

  return clickedCells;
};

const CellNumber = ({ number }: { number: number }) => {
  switch (number) {
    case 0:
      return null;
    case 1:
      return <span className="font-semibold text-blue-800">1</span>;
    case 2:
      return <span className="font-semibold text-green-700">2</span>;
    case 3:
      return <span className="font-semibold text-red-600">3</span>;
    case 4:
      return <span className="font-semibold text-indigo-900">4</span>;
    case 5:
      return <span className="font-semibold text-yellow-900">5</span>;
    case 6:
      return <span className="font-semibold text-green-700">6</span>;
    case 7:
      return <span className="font-semibold text-gray-800">7</span>;
    case 8:
      return <span className="font-semibold text-gray-700">8</span>;
    default:
      return null;
  }
};

export const Cell = ({
  mineMap,
  idx,
}: {
  mineMap: Set<number>;
  idx: number;
}) => {
  const {
    clickedCells,
    setClickedCells,
    flaggedCells,
    setFlaggedCells,
    gameLost,
    setGameLost,
  } = useGameState();
  const {
    settings: { width: w, height: h },
  } = useSettings();
  const clicked = clickedCells.has(idx);
  const flagged = flaggedCells.has(idx);
  const isMine = mineMap.has(idx);
  const proximateMines = useMemo(
    () => getProximateCells(idx, w, h),
    [w, h, idx]
  );
  const proximateMineCount = useMemo(
    () =>
      proximateMines.reduce(
        (acc, cur) => (mineMap.has(cur) ? acc + 1 : acc),
        0
      ),
    [proximateMines, mineMap]
  );

  if (clicked)
    return isMine ? (
      <button className="block border-box p-0 w-8 h-8 bg-red-600">
        &#128163;
      </button>
    ) : (
      <button
        className="block text-base border-box p-0 text-sm w-8 h-8 bg-gray-400"
        disabled={gameLost}
        onAuxClick={() => {
          const flaggedCellCount = proximateMines.reduce(
            (acc, cur) => (flaggedCells.has(cur) ? acc + 1 : acc),
            0
          );
          if (flaggedCellCount === proximateMineCount) {
            proximateMines.forEach((c) => {
              if (!flaggedCells.has(c)) {
                clickedCells.add(c);

                if (mineMap.has(c)) {
                  setGameLost(true);
                }
              }

              setClickedCells(new Set(clickedCells));
            });
          }
        }}
      >
        <CellNumber number={proximateMineCount} />
      </button>
    );

  return (
    <button
      className="block border-box p-0 text-sm w-8 h-8 border-4 bg-gray-400 border-gray-200 border-r-gray-600 border-b-gray-600"
      onClick={() => {
        if (isMine && clickedCells.size > 0) {
          setGameLost(true);
        }
        setClickedCells(
          new Set(collectProximateEmptyCells(mineMap, idx, w, h, clickedCells))
        );
      }}
      onContextMenu={() => {
        setFlaggedCells(new Set(flaggedCells.add(idx)));
        return false;
      }}
      disabled={gameLost}
    >
      {flagged ? <span>&#128681;</span> : null}
    </button>
  );
};
