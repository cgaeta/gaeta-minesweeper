import { useMemo, useState, type ReactNode } from "react";
import "./App.css";

type GameSettings = { width: number; height: number; mines: number };
const Settings = ({
  saveSettings,
  setGameStarted,
}: {
  saveSettings: (settings: GameSettings) => void;
  setGameStarted: (s: boolean) => void;
}) => {
  const [settings, setSettings] = useState({
    height: 30,
    width: 30,
    mines: 120,
  });
  const [checked, setChecked] = useState("beginner");
  return (
    <div>
      <h3 className="text-lg font-bold">Game Size</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Height</th>
            <th>Width</th>
            <th>Mines</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left">
              <label>
                <input
                  type="radio"
                  className="mr-2"
                  name="difficulty"
                  value="beginner"
                  checked={checked === "beginner"}
                  onChange={() => setChecked("beginner")}
                />
                Beginner
              </label>
            </td>
            <td>9</td>
            <td>9</td>
            <td>10</td>
          </tr>
          <tr>
            <td className="text-left">
              <label>
                <input
                  type="radio"
                  className="mr-2"
                  name="difficulty"
                  value="intermediate"
                  checked={checked === "intermediate"}
                  onChange={() => setChecked("intermediate")}
                />
                Intermediate
              </label>
            </td>
            <td>16</td>
            <td>16</td>
            <td>40</td>
          </tr>
          <tr>
            <td className="text-left">
              <label>
                <input
                  type="radio"
                  className="mr-2"
                  name="difficulty"
                  value="expert"
                  checked={checked === "expert"}
                  onChange={() => setChecked("expert")}
                />
                Expert
              </label>
            </td>
            <td>16</td>
            <td>30</td>
            <td>99</td>
          </tr>
          <tr>
            <td className="text-left">
              <label>
                <input
                  type="radio"
                  className="mr-2"
                  name="difficulty"
                  value="custom"
                  checked={checked === "custom"}
                  onChange={() => setChecked("custom")}
                />
                Custom
              </label>
            </td>
            <td>
              <input
                type="number"
                min="1"
                name="height"
                value={settings.height}
                onChange={(ev) =>
                  setSettings((s) => ({
                    ...s,
                    height: Number.parseInt(ev.target.value),
                  }))
                }
              />
            </td>
            <td>
              <input
                type="number"
                min="1"
                name="width"
                value={settings.width}
                onChange={(ev) =>
                  setSettings((s) => ({
                    ...s,
                    width: Number.parseInt(ev.target.value),
                  }))
                }
              />
            </td>
            <td>
              <input
                type="number"
                min="1"
                name="mines"
                value={settings.mines}
                onChange={(ev) =>
                  setSettings((s) => ({
                    ...s,
                    mines: Number.parseInt(ev.target.value),
                  }))
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button
        className="block mt-4 ml-auto mr-0 p-2 border border-gray-200"
        onClick={() => {
          switch (checked) {
            case "beginner":
              saveSettings({ height: 9, width: 9, mines: 10 });
              break;
            case "intermediate":
              saveSettings({ height: 16, width: 16, mines: 40 });
              break;
            case "expert":
              saveSettings({ height: 16, width: 30, mines: 99 });
              break;
            case "custom":
              saveSettings(settings);
              break;
            default:
              throw new Error("Invalid game board value!");
          }
          setGameStarted(true);
        }}
      >
        Start
      </button>
    </div>
  );
};

const shuffle = <T,>(array: T[]) => {
  for (var i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

const Cell = ({
  gameBoard,
  i,
  j,
  children = null,
}: {
  gameBoard: string[][];
  i: number;
  j: number;
  children: ReactNode;
}) => {
  const [clicked, setClicked] = useState("unclicked");
  const isMine = gameBoard[i][j] === "!";
  const proximateMines = useMemo(() => {
    return gameBoard
      .slice(Math.max(0, i - 1), Math.min(gameBoard.length + 1, i + 2))
      .map((row) =>
        row.slice(Math.max(0, j - 1), Math.min(row.length + 1, j + 2))
      );
  }, [gameBoard, i, j]);

  if (clicked === "clicked")
    return isMine ? (
      <button className="block border-box p-0 w-8 h-8 bg-red-600"></button>
    ) : (
      <button
        className="block border-box p-0 text-sm w-8 h-8 bg-gray-500"
        onClick={() => setClicked("clicked")}
      >
        {proximateMines.flat().filter((c) => c === "!").length}
      </button>
    );

  return (
    <button
      className="block border-box p-0 text-sm w-8 h-8 border-4 bg-gray-400 border-gray-200 border-r-gray-600 border-b-gray-600"
      onClick={() => setClicked("clicked")}
    >
      {clicked === "unclicked" && children}
      {clicked === "clicked" &&
        proximateMines.flat().filter((c) => c === "!").length}
    </button>
  );
};

function App() {
  const [settings, setSettings] = useState({ width: 9, height: 9, mines: 10 });
  const [gameStarted, setGameStarted] = useState(false);
  const gameBoard = useMemo(() => {
    if (gameStarted) {
      console.log(new Array(settings.height));

      const size = settings.width * settings.height;
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

  return (
    <div className="App">
      {gameStarted ? (
        <table>
          {gameBoard.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={`${i}-${j}`}>
                  <Cell gameBoard={gameBoard} i={i} j={j}>
                    {cell}
                  </Cell>
                </td>
              ))}
            </tr>
          ))}
        </table>
      ) : (
        <Settings saveSettings={setSettings} setGameStarted={setGameStarted} />
      )}
      <div>
        {settings.width} x {settings.height}
      </div>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
