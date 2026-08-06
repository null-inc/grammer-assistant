import { ref } from "vue";
import type {
  AIRewriter,
  RewriteRequest,
  RewriteStatus,
} from "../types/ai-rewriter.types";

export default function useAIRewrite(rewriter: AIRewriter) {
  const status = ref<RewriteStatus>("idle");
  const rewrittenText = ref("");
  const errorMessage = ref("");

  async function rewrite(request: RewriteRequest) {
    if (status.value === "loading") return;

    if (errorMessage.value !== "") errorMessage.value = "";

    status.value = "loading";

    try {
      rewrittenText.value = await rewriter.rewrite(request);
      status.value = "success";
    } catch {
      status.value = "error";
      errorMessage.value = "Could not rewrite text. Please try again.";
    }
  }

  return {
    rewrite,
    rewrittenText,
    status,
    errorMessage,
  };
}
