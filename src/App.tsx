import { useMemo, useState, useEffect, type ReactNode } from "react";
import "./App.css";
import { Cell } from "./components/Cell";
import { Settings } from "./components/Settings";

const shuffle = <T,>(array: T[]) => {
  for (var i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

function App() {
  const [settings, setSettings] = useState({ width: 9, height: 9, mines: 10 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [clickedCells, setClickedCells] = useState(new Set<string>());
  const [flaggedCells, setFlaggedCells] = useState(new Set<string>());

  const size = settings.width * settings.height;
  const gameWon = clickedCells.size === size - settings.mines && !gameLost;

  const gameBoard = useMemo(() => {
    if (gameStarted) {
      let board = new Array(settings.mines)
        .fill("!")
        .concat(new Array(size - settings.mines));
      shuffle(board);
      return board
        .slice(0, settings.height)
        .map((_v, i) =>
          board.slice(i * settings.width, (i + 1) * settings.width)
        );
    }
    return [];
  }, [settings, gameStarted]);

  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

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
