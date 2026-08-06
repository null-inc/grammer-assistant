import { describe, expect, it, vi } from "vitest";
import useAIConfiguration from "../core/ai-config";
import { AIConfiguration } from "../types/ai-config.types";

describe("useAiConfiguration", () => {
  it("sets the status to missing when AI is not configured", async () => {
    const aiConfiguration: AIConfiguration = {
      isConfigured: vi.fn().mockResolvedValue(false),
    };

    const { checkConfiguration, configurationStatus } =
      useAIConfiguration(aiConfiguration);

    await checkConfiguration();

    expect(aiConfiguration.isConfigured).toHaveBeenCalledOnce();

    expect(configurationStatus.value).toBe("missing");
  });
});
