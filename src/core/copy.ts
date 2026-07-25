import type { Clipboard } from "../types/copy.types";
import { ref } from "vue";

export default function useCopy(clipboard: Clipboard) {
  const internalClipboardText = ref<string | null>(null);

  async function copyText(text: string) {
    try {
      await clipboard.writeText(text);
      internalClipboardText.value = text;
    } catch (e) {
      throw new Error("Clipboard could not write text.", { cause: e });
    }
  }

  async function readCopy(): Promise<string> {
    try {
      const text = await clipboard.readText();
      internalClipboardText.value = text ?? "";
      return internalClipboardText.value;
    } catch {
      console.error("Could not read clipboard");
      return "";
    }
  }

  return {
    copyText,
    readCopy,
  };
}
