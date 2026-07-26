import type { Clipboard, CopyStatus } from "../types/copy.types";
import { ref } from "vue";

export default function useCopy(clipboard: Clipboard) {
  const copyStatus = ref<CopyStatus>("idle");

  async function copyClipboardText(text: string) {
    copyStatus.value = "copying";

    try {
      await clipboard.writeText(text);
      copyStatus.value = "success";
    } catch (e) {
      copyStatus.value = "error";
      throw new Error("Clipboard could not write text.", { cause: e });
    }
  }

  async function readClipboardText(): Promise<string> {
    try {
      return await clipboard.readText();
    } catch {
      console.error("Could not read clipboard");
      return "";
    }
  }

  return {
    copyClipboardText,
    readClipboardText,
    copyStatus,
  };
}
