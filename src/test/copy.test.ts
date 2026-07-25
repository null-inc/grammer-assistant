import { describe, expect, it, vi } from "vitest";
import useCopy from "../core/copy";

describe("Copy", () => {
  it("returns a string", async () => {
    let clipboardText = "";

    const clipboard = {
      writeText: vi.fn().mockImplementation(async (text: string) => {
        clipboardText = text;
      }),
      readText: vi.fn().mockImplementation(async () => {
        return clipboardText;
      }),
    };

    const { readCopy, copyText } = useCopy(clipboard);

    await copyText("");

    expect(await readCopy()).toBeTypeOf("string");
  });

  it("reads back copied text from the clipboard adapter", async () => {
    let clipboardText = "";

    const clipboard = {
      writeText: vi.fn().mockImplementation(async (text: string) => {
        clipboardText = text;
      }),
      readText: vi.fn().mockImplementation(async () => {
        return clipboardText;
      }),
    };
    const text = "Meshuggah";
    const { readCopy, copyText } = useCopy(clipboard);
    await copyText(text);
    expect(await readCopy()).toBe(text);
  });

  it("sets copy status to success when text is copied", async () => {
    let clipboardText = "";

    const clipboard = {
      writeText: vi.fn().mockImplementation(async (text: string) => {
        clipboardText = text;
      }),
      readText: vi.fn().mockImplementation(async () => clipboardText),
    };

    const { copyText, copyStatus } = useCopy(clipboard);

    await copyText("hello");

    expect(copyStatus.value).toBe("success");
  });

  it("sets copy status to error when copying fails", async () => {
    const clipboard = {
      writeText: vi.fn().mockRejectedValue(new Error("No Permission")),
      readText: vi.fn().mockResolvedValue(""),
    };

    const { copyText, copyStatus } = useCopy(clipboard);

    await expect(copyText("")).rejects.toThrow();
    expect(copyStatus.value).toBe("error");
  });
});
