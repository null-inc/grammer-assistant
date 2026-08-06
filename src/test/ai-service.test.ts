import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAIRewriteService } from "../services/ai-service";

const tauriMocks = vi.hoisted(() => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/core", () => ({
  invoke: tauriMocks.invoke,
}));

describe("createAIRewriteService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("check configuration through a Tauri command", async () => {
    tauriMocks.invoke.mockResolvedValue(true);

    const service = createAIRewriteService();

    await expect(service.isConfigured()).resolves.toBe(true);
    expect(tauriMocks.invoke).toHaveBeenCalledWith("is_openai_configured");
  });
});
