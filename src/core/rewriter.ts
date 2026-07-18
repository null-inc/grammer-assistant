import {
  rewriteTextResponse,
  rewriteTextSetting,
} from "../types/rewriter.types";

import { ensurePeriod, trimWhitespace, capitalize } from "../utils/text.utils";

export function isValidSetting(value: unknown): value is rewriteTextSetting {
  if (typeof value !== "string") return false;
  if (value.trim().length === 0) return false;

  return value === "more-professional" || value === "more-concise";
}

export function rewriteText(
  text: string,
  setting: rewriteTextSetting,
): rewriteTextResponse {
  if (!isWithinCharacterLimit(text)) {
    throw new Error("Input cannot exceed 500 characters.");
  }

  let textCopy = trimWhitespace(text);

  if (textCopy === "") {
    return formatRewriterResponse("", setting);
  }

  if (setting === "more-professional") {
    textCopy = replaceGreeting(textCopy);
  } else if (setting === "more-concise") {
    textCopy = removeFillerWords(textCopy);
  }

  textCopy = capitalize(textCopy);
  textCopy = ensurePeriod(textCopy);

  return formatRewriterResponse(textCopy, setting);
}

function removeFillerWords(text: string): string {
  const fillerWords = ["very", "really"];
  const words = text.split(" ");

  const filteredWords = words.filter((word) => {
    return fillerWords.includes(word.toLowerCase()) ? false : true;
  });

  return filteredWords.join(" ");
}

function replaceGreeting(text: string): string {
  const greetings = ["hey", "yo", "wassup"];
  const words = text.split(" ");
  const greeting = words[0];

  if (greetings.includes(greeting.toLowerCase())) {
    words[0] = "hello";
  }

  return words.join(" ");
}

function isWithinCharacterLimit(text: string): boolean {
  const chars = text.split("");
  return chars.length > 500 ? false : true;
}

function formatRewriterResponse(
  value: string,
  setting: rewriteTextSetting,
): rewriteTextResponse {
  return {
    setting: setting,
    response: value,
  };
}
