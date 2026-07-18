import { describe, expect, it } from "vitest";
import { createReviewState } from "../core/review-state";

describe("createReviewState", () => {
  it("given original text and selected setting, create rewriteSession returns original text, selected setting, rewritten text, and no error", () => {
    expect(
      createReviewState("Hey    i need help", "more-professional"),
    ).toEqual({
      originalText: "Hey    i need help",
      selectedSetting: "more-professional",
      rewrittenText: "Hello i need help.",
      errorMessage: "",
    });
  });
});
