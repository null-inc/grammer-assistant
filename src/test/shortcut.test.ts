import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerGlobalShortcut } from "../services/global-shortcut";

const tauriMocks = vi.hoisted(() => ({
  handler: undefined as
    | ((event: {
        state: "Pressed" | "Released";
        shortcut: string;
        id: number;
      }) => void)
    | undefined,
  register: vi.fn(),
  isRegistered: vi.fn(),
  unregister: vi.fn(),
}));

vi.mock("@tauri-apps/api/core", () => ({
  isTauri: () => true,
}));

vi.mock("@tauri-apps/plugin-global-shortcut", () => ({
  register: tauriMocks.register,
  isRegistered: tauriMocks.isRegistered,
  unregister: tauriMocks.unregister,
}));

describe("registerGlobalShortcut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tauriMocks.handler = undefined;
    tauriMocks.isRegistered.mockResolvedValue(false);

    tauriMocks.register.mockImplementation(async (_shortcut, handler) => {
      tauriMocks.handler = handler;
    });
  });

  it("runs the callback when the shortcut is pressed", async () => {
    const onTriggered = vi.fn();

    await registerGlobalShortcut(onTriggered);

    tauriMocks.handler?.({
      state: "Pressed",
      shortcut: "CommandOrControl+Alt+G",
      id: 1,
    });

    expect(onTriggered).toHaveBeenCalledOnce();
    expect(tauriMocks.register).toHaveBeenCalledWith(
      "CommandOrControl+Alt+G",
      expect.any(Function),
    );
  });

  it("does not run the callback when the shortcut is released", async () => {
    const onTriggered = vi.fn();

    await registerGlobalShortcut(onTriggered);

    tauriMocks.handler?.({
      state: "Released",
      shortcut: "CommandOrControl+Alt+G",
      id: 1,
    });

    expect(onTriggered).not.toHaveBeenCalled();
    expect(tauriMocks.register).toHaveBeenCalledWith(
      "CommandOrControl+Alt+G",
      expect.any(Function),
    );
  });
});
