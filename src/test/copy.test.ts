import { describe, expect, it, vi } from "vitest";
import useCopy from "../core/copy";

describe("Copy", () => {
  let clipboardText = "";
  const writeText = vi.fn().mockImplementation(async (text: string) => {
    clipboardText = text;
  });
  const readText = vi.fn().mockImplementation(async () => clipboardText);

  it("returns a string", async () => {
    const { readCopy, copyText } = useCopy({ writeText, readText });

    await copyText("");

    expect(await readCopy()).toBeTypeOf("string");
  });

  it("stores given text in the useCopy state", async () => {
    const text = "Meshuggah";
    const { readCopy, copyText } = useCopy({ writeText, readText });
    await copyText(text);
    expect(await readCopy()).toBe(text);
  });
});
