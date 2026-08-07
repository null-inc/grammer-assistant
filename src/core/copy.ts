import type {
  Clipboard,
  ClipboardReadStatus,
  CopyStatus,
} from "../types/copy.types";
import { ref } from "vue";

export default function useCopy(clipboard: Clipboard) {
  const copyStatus = ref<CopyStatus>("idle");
  const readStatus = ref<ClipboardReadStatus>("idle");

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
    readStatus.value = "reading";

    try {
      const text = await clipboard.readText();
      readStatus.value = text === "" ? "empty" : "success";
      return text;
    } catch {
      readStatus.value = "error";
      return "";
    }
  }

  function clearReadStatus() {
    readStatus.value = "idle";
  }

  return {
    copyClipboardText,
    readClipboardText,
    copyStatus,
    readStatus,
    clearReadStatus,
  };
}
