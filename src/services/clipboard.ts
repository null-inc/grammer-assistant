import { isTauri } from "@tauri-apps/api/core";
import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";
import type { Clipboard } from "../types/copy.types";

function createBrowserClipboard(): Clipboard {
  return {
    writeText: (text: string) => navigator.clipboard.writeText(text),
    readText: () => navigator.clipboard.readText(),
  };
}

// TODO
function createTauriClipboard(): Clipboard {
  return {
    writeText: (text) => writeText(text),
    readText: () => readText(),
  };
}

export function createClipboard() {
  if (isTauri()) {
    return createTauriClipboard();
  }

  return createBrowserClipboard();
}
