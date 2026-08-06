import { vi, it, expect, describe } from "vitest";
import type { AIRewriter, RewriteRequest } from "../types/ai-rewriter.types";
import useAIRewrite from "../core/ai-rewrite";

describe("AIRewriter", () => {
  it("stores a successful English rewrite", async () => {
    const aiRewriter: AIRewriter = {
      rewrite: vi.fn().mockResolvedValue("Hello, I need some help."),
    };

    const { rewrite, rewrittenText, status } = useAIRewrite(aiRewriter);

    const request: RewriteRequest = {
      text: "hey i need some help",
      setting: "more-professional",
    };

    await rewrite(request);

    expect(aiRewriter.rewrite).toHaveBeenCalledWith(request);
    expect(rewrittenText.value).toBe("Hello, I need some help.");
    expect(status.value).toBe("success");
  });

  it("sets the status to error when rewrite fails", async () => {
    const aiRewriter: AIRewriter = {
      rewrite: vi.fn().mockRejectedValue(new Error()),
    };

    const { rewrite, rewrittenText, status } = useAIRewrite(aiRewriter);

    const request: RewriteRequest = {
      text: "HELP, i need somebody, not just anybody, HELP",
      setting: "more-professional",
    };

    await rewrite(request);

    expect(aiRewriter.rewrite).toHaveBeenCalledWith(request);
    expect(rewrittenText.value).toBe("");
    expect(status.value).toBe("error");
  });

  it("ignores another rewrite while one is already loading", async () => {
    // use deffered Promise pattern to test the desired loading behaviour
    let resolveRewrite!: (text: string) => void;

    const pendingRewrite = new Promise<string>((resolve) => {
      resolveRewrite = resolve;
    });

    const aiRewriter: AIRewriter = {
      rewrite: vi.fn().mockReturnValue(pendingRewrite),
    };

    const { rewrite, status } = useAIRewrite(aiRewriter);

    const request: RewriteRequest = {
      text: "hey i need some help",
      setting: "more-professional",
    };

    const firstRewrite = rewrite(request);

    expect(status.value).toBe("loading");

    const secondRewrite = rewrite(request);

    expect(aiRewriter.rewrite).toHaveBeenCalledOnce();

    resolveRewrite("Hello, I need some help.");

    await Promise.all([firstRewrite, secondRewrite]);
    expect(status.value).toBe("success");
  });

  // Ensuring the correct language should be handled by the LLM request on the backend side, this just verifies that the frontend don't modify the response
  it("stores a successful Swedish rewrite without modifying it", async () => {
    const aiRewriter: AIRewriter = {
      rewrite: vi.fn().mockResolvedValue("Hej, jag behöver hjälp med det här."),
    };

    const { rewrite, rewrittenText, status } = useAIRewrite(aiRewriter);

    const request: RewriteRequest = {
      text: "hej jag behöver hjälp med det här",
      setting: "more-professional",
    };

    await rewrite(request);

    expect(aiRewriter.rewrite).toHaveBeenCalledWith(request);
    expect(rewrittenText.value).toBe("Hej, jag behöver hjälp med det här.");
    expect(status.value).toBe("success");
  });
});
