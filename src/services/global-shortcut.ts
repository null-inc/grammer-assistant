import {
  register,
  isRegistered,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";
import { isTauri } from "@tauri-apps/api/core";

const shortcut = "CommandOrControl+Alt+Shift+G";

export async function registerGlobalShortcut() {
  if (!isTauri()) {
    console.log("skipping global shortcut outside tauri");
    return;
  }

  try {
    if (await isRegistered(shortcut)) {
      await unregister(shortcut);
    }

    await register(shortcut, (event) => {
      if (event.state === "Pressed") {
        console.log("Shortcut triggered");
      }
    });
    console.log("Global shortcut registered");
  } catch (error) {
    console.error("Could not register global shortcut", error);
  }
}
