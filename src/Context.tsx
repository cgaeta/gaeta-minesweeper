import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { GameSettings } from "./components/Settings";

export const SettingsContext = createContext({
  settings: { width: 9, height: 9, mines: 10 },
  setSettings: (s: GameSettings) => {},
});
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState({ width: 9, height: 9, mines: 10 });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

type SetState<T> = Dispatch<SetStateAction<T>>;

type GameState = {
  gameStarted: boolean;
  setGameStarted: SetState<boolean>;
  gameLost: boolean;
  setGameLost: SetState<boolean>;
  clickedCells: Set<number>;
  setClickedCells: SetState<Set<number>>;
  flaggedCells: Set<number>;
  setFlaggedCells: SetState<Set<number>>;
};
export const GameStateContext = createContext<GameState>({} as GameState);
export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [clickedCells, setClickedCells] = useState(new Set<number>());
  const [flaggedCells, setFlaggedCells] = useState(new Set<number>());

  return (
    <GameStateContext.Provider
      value={{
        gameStarted,
        setGameStarted,
        gameLost,
        setGameLost,
        clickedCells,
        setClickedCells,
        flaggedCells,
        setFlaggedCells,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
