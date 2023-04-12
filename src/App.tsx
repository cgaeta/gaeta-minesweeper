import { useMemo, useState, useRef } from "react";
import "./App.css";
import { Cell } from "./components/Cell";
import { Settings } from "./components/Settings";
import { useDisableContextMenu } from "./hooks";
import { shuffle, to2dArray, getIndices, createNewBoard } from "./utils";

function App() {
  const [settings, setSettings] = useState({ width: 9, height: 9, mines: 10 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [clickedCells, setClickedCells] = useState(new Set<string>());
  const [flaggedCells, setFlaggedCells] = useState(new Set<string>());

  const size = settings.width * settings.height;
  const gameWon = clickedCells.size === size - settings.mines && !gameLost;

  const gameBoardRef = useRef<string[][]>();
  const gameBoard = useMemo(() => {
    if (gameStarted) {
      if (clickedCells.size === 1) {
        const firstClick = clickedCells.values().next().value;
        if (firstClick) {
          let board = gameBoardRef.current?.flat();
          if (!board) throw new Error("Board not initialized on first click!");

          const [i, j] = getIndices(firstClick);

          while (board[i * settings.height + j] === "!") {
            shuffle(board);
          }

          gameBoardRef.current = to2dArray(
            board,
            settings.width,
            settings.height
          );
          return gameBoardRef.current;
        } else {
          throw new Error("Invalid indices!");
        }
      } else if (clickedCells.size === 0) {
        gameBoardRef.current = createNewBoard(settings);
        return gameBoardRef.current;
      }

      if (!gameBoardRef.current)
        throw new Error("Game board not initialized after first click!");
      return gameBoardRef.current;
    }

    return [];
  }, [settings, gameStarted, clickedCells]);

  useDisableContextMenu();

  return (
    <div className="App">
      {gameStarted ? (
        <table>
          <tbody>
            {gameBoard.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={`${i}-${j}`}>
                    <Cell
                      clickedCells={clickedCells}
                      setClickedCells={setClickedCells}
                      flaggedCells={flaggedCells}
                      setFlaggedCells={setFlaggedCells}
                      gameBoard={gameBoard}
                      gameLost={gameLost}
                      setGameLost={setGameLost}
                      i={i}
                      j={j}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Settings
          setGameSettings={setSettings}
          setGameStarted={setGameStarted}
        />
      )}
      <div>
        {settings.width} x {settings.height}
      </div>
      <div className="text-center">
        <p>
          {(gameLost || gameWon) && (
            <button
              className="mt-2"
              onClick={() => {
                setGameLost(false);
                setGameStarted(false);
                setClickedCells(new Set());
                setFlaggedCells(new Set());
              }}
            >
              Play Again {gameWon && <span>&#127878;</span>}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export default App;
