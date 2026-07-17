export type rewriteTextSetting = "more-professional" | "more-concise";

export type rewriteTextResponse = {
  setting: rewriteTextSetting;
  response: string;
};
