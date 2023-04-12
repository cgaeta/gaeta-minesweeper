import { useState } from "react";

export type GameSettings = { width: number; height: number; mines: number };
export const Settings = ({
  setGameSettings,
  setGameStarted,
}: {
  setGameSettings: (settings: GameSettings) => void;
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
              setGameSettings({ height: 9, width: 9, mines: 10 });
              break;
            case "intermediate":
              setGameSettings({ height: 16, width: 16, mines: 40 });
              break;
            case "expert":
              setGameSettings({ height: 16, width: 30, mines: 99 });
              break;
            case "custom":
              setGameSettings(settings);
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
