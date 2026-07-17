import { describe, expect, it } from "vitest";
import { rewriteText } from "../core/rewriter";

describe("rewriteText", () => {
  it("return an empty string when the input is blank", () => {
    expect(rewriteText("", "more-concise")).toEqual({
      setting: "more-concise",
      response: "",
    });
  });

  it("makes text more professional with deterministic cleanup", () => {
    expect(
      rewriteText("  Hey   i need this to be fixed", "more-professional"),
    ).toEqual({
      setting: "more-professional",
      response: "Hello i need this to be fixed.",
    });
  });

  it("makes text more concise by removing simple filler words", () => {
    expect(rewriteText("this is really very useful", "more-concise")).toEqual({
      setting: "more-concise",
      response: "This is useful.",
    });
  });

  it("removes filler words regardless of casing", () => {
    expect(rewriteText("Really very useful", "more-concise")).toEqual({
      setting: "more-concise",
      response: "Useful.",
    });
  });
});
