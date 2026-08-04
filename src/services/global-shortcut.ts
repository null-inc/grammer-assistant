import { isTauri } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

const shortcutEvent = "global-shortcut-triggered";

export async function listenForGlobalShortcut(
  onTriggered: () => void | Promise<void>,
): Promise<UnlistenFn> {
  if (!isTauri()) {
    console.log("skipping global shortcut outside tauri");
    return () => {};
  }

  return listen(shortcutEvent, () => {
    void onTriggered();
  });
}
