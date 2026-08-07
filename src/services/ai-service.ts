import { invoke } from "@tauri-apps/api/core";
import type { AIConfiguration } from "../types/ai-config.types";

export function createAIRewriteService(): AIConfiguration {
  function isConfigured() {
    return invoke<boolean>("is_openai_configured");
  }

  return {
    isConfigured,
  };
}
