import type { GameSettings } from "./components/Settings";

export const createNewBoard = ({ width, height, mines }: GameSettings) => {
  const mineMap = new Set<number>();
  const size = width * height;
  while (mineMap.size < mines) {
    mineMap.add(Math.floor(Math.random() * size));
  }

  return mineMap;
};
