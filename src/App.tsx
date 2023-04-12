import "./App.css";
import { GameStateProvider, SettingsProvider } from "./Context";
import { BoardGrid } from "./components/BoardGrid";
import { useDisableContextMenu, useGameState, useSettings } from "./hooks";

const RestartButton = () => {
  const {
    gameLost,
    setGameLost,
    setGameStarted,
    clickedCells,
    setClickedCells,
    setFlaggedCells,
  } = useGameState();
  const {
    settings: { width, height, mines },
  } = useSettings();

  const gameWon = !gameLost && clickedCells.size === width * height - mines;

  return gameLost || gameWon ? (
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
  ) : null;
};

function App() {
  useDisableContextMenu();

  return (
    <SettingsProvider>
      <GameStateProvider>
        <div className="App">
          <BoardGrid />
          <div className="text-center">
            <p>
              <RestartButton />
            </p>
          </div>
        </div>
      </GameStateProvider>
    </SettingsProvider>
  );
}

export default App;
