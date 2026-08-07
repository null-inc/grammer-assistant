import { invoke } from "@tauri-apps/api/core";
import { AIService } from "../types/ai-service.types";
import { RewriteRequest } from "../types/ai-rewriter.types";

export function createAIRewriteService(): AIService {
  function isConfigured() {
    return invoke<boolean>("is_openai_configured");
  }

  function rewrite(request: RewriteRequest) {
    return invoke<string>("rewrite_with_openai", { request });
  }

  return {
    isConfigured,
    rewrite,
  };
}
