export function ensurePeriod(text: string): string {
  return text.endsWith(".") ? text : text + ".";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function trimWhitespace(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}
