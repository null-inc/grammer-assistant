import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAIRewriteService } from "../services/ai-service";
import type { RewriteRequest } from "../types/ai-rewriter.types";

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

  it("requests a rewrite through a Tauri command", async () => {
    const request: RewriteRequest = {
      text: "hey i need some help",
      setting: "more-professional",
    };

    tauriMocks.invoke.mockResolvedValue("Hello, I need some help.");

    const service = createAIRewriteService();

    await expect(service.rewrite(request)).resolves.toBe(
      "Hello, I need some help.",
    );

    expect(tauriMocks.invoke).toHaveBeenCalledWith("rewrite_with_openai", {
      request,
    });
  });
});
