import { describe, expect, it } from "vitest";
import useCopy from "../core/copy";

describe("Copy", () => {
  it("returns a string", () => {
    const { copy } = useCopy();
    expect(copy.value).toBeTypeOf("string");
  });

  it("stores given text in the useCopy state", () => {
    const text = "Meshuggah";
    const { copy } = useCopy(text);
    expect(copy.value).toBe(text);
  });
});
