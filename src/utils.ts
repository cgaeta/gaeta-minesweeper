import type { GameSettings } from "./components/Settings";

export const shuffle = <T>(array: T[]) => {
  for (var i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

export const to2dArray = (arr: string[], height: number, width: number) =>
  arr
    .slice(0, height)
    .map((_ignore, idx) => arr.slice(idx * width, (idx + 1) * width));

const parseFirstClick = /(\d+)-(\d+)/;
export const getIndices = (str: string) => {
  const res = parseFirstClick.exec(str);
  if (!res) throw new Error("Invalid indices!");

  const [_str, a, b] = res;
  const i = parseInt(a);
  const j = parseInt(b);

  if (isNaN(i) || isNaN(j)) throw new Error("Invalid indices!");

  return [i, j] as const;
};

export const createNewBoard = ({ width, height, mines }: GameSettings) => {
  let board = new Array(mines)
    .fill("!")
    .concat(new Array(width * height - mines));

  shuffle(board);
  return to2dArray(board, height, width);
};
