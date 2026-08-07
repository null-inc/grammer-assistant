export type Clipboard = {
  writeText: (text: string) => Promise<void>;
  readText: () => Promise<string>;
};

export type CopyStatus = "idle" | "copying" | "success" | "error";

export type ClipboardReadStatus =
  "idle" | "reading" | "success" | "empty" | "error";
