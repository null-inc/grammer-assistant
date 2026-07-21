import { describe, expect, it } from "vitest";
import { createReviewState } from "../core/review-state";

describe("createReviewState", () => {
  it("creates review state with original text, selected setting, rewritten text, and no error", () => {
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
