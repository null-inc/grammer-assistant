import {
  rewriteTextResponse,
  rewriteTextSetting,
} from "../types/rewriter.types";

export function isValidSetting(value: string): value is rewriteTextSetting {
  if (!value) return false;
  if (typeof value !== "string") return false;
  if (!value.trim().length) return false;

  return value === "more-professional" || value === "more-concise";
}

export function rewriteText(
  text: string,
  setting: rewriteTextSetting,
): rewriteTextResponse {
  let textCopy = text.trim();

  if (textCopy === "") {
    return {
      setting: setting,
      response: "",
    };
  }

  textCopy = textCopy.endsWith(".") ? textCopy : textCopy + ".";

  textCopy = textCopy
    .split(/\s+/)
    .map((word) => (word.toLowerCase() === "hey" ? "hello" : word))
    .join(" ");

  const result = textCopy.charAt(0).toUpperCase() + textCopy.slice(1);

  return {
    setting: setting,
    response: result,
  };
}
