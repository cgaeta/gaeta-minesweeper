import { useEffect, useContext } from "react";
import { GameStateContext, SettingsContext } from "./Context";

export const useDisableContextMenu = () => {
  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
};

export const useSettings = () => useContext(SettingsContext);

export const useGameState = () => useContext(GameStateContext);
