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

    const { readClipboardText, copyClipboardText } = useCopy(clipboard);

    await copyClipboardText("");

    expect(await readClipboardText()).toBeTypeOf("string");
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
    const { readClipboardText, copyClipboardText } = useCopy(clipboard);
    await copyClipboardText(text);
    expect(await readClipboardText()).toBe(text);
  });

  it("sets copy status to success when text is copied", async () => {
    let clipboardText = "";

    const clipboard = {
      writeText: vi.fn().mockImplementation(async (text: string) => {
        clipboardText = text;
      }),
      readText: vi.fn().mockImplementation(async () => clipboardText),
    };

    const { copyClipboardText, copyStatus } = useCopy(clipboard);

    await copyClipboardText("hello");

    expect(copyStatus.value).toBe("success");
  });

  it("sets copy status to error when copying fails", async () => {
    const clipboard = {
      writeText: vi.fn().mockRejectedValue(new Error("No Permission")),
      readText: vi.fn().mockResolvedValue(""),
    };

    const { copyClipboardText, copyStatus } = useCopy(clipboard);

    await expect(copyClipboardText("")).rejects.toThrow();
    expect(copyStatus.value).toBe("error");
  });

  it("returns an empty string when reading from clipboard fails", async () => {
    const clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockRejectedValue(new Error("No permission")),
    };

    const { readClipboardText, readStatus } = useCopy(clipboard);

    await expect(readClipboardText()).resolves.toBe("");
    expect(readStatus.value).toBe("error");
  });

  it("reports when the clipboard is empty", async () => {
    const clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(""),
    };

    const { readClipboardText, readStatus } = useCopy(clipboard);

    await expect(readClipboardText()).resolves.toBe("");
    expect(readStatus.value).toBe("empty");
  });
});
