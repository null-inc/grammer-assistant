import { beforeEach, describe, expect, it, vi } from "vitest";
import { listenForGlobalShortcut } from "../services/global-shortcut";

const tauriMocks = vi.hoisted(() => ({
  handler: undefined as (() => void) | undefined,
  listen: vi.fn(),
  unlisten: vi.fn(),
}));

vi.mock("@tauri-apps/api/core", () => ({
  isTauri: () => true,
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: tauriMocks.listen,
}));

describe("listenForGlobalShortcut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tauriMocks.handler = undefined;

    tauriMocks.listen.mockImplementation(async (_event, handler) => {
      tauriMocks.handler = handler;
      return tauriMocks.unlisten;
    });
  });

  it("runs the callback when the portal shortcut event is received", async () => {
    const onTriggered = vi.fn();

    await listenForGlobalShortcut(onTriggered);

    tauriMocks.handler?.();

    expect(onTriggered).toHaveBeenCalledOnce();
    expect(tauriMocks.listen).toHaveBeenCalledWith(
      "global-shortcut-triggered",
      expect.any(Function),
    );
  });

  it("returns the event listener cleanup function", async () => {
    const unlisten = await listenForGlobalShortcut(vi.fn());

    unlisten();

    expect(tauriMocks.unlisten).toHaveBeenCalledOnce();
  });
});
