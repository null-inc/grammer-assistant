export type Clipboard = {
  writeText: (text: string) => Promise<void>;
  readText: () => Promise<string>;
};
