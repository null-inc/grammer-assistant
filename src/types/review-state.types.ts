import { type rewriteTextSetting } from "./rewriter.types";

export type ReviewState = {
  selectedSetting: rewriteTextSetting;
  rewrittenText: string;
  originalText: string;
  errorMessage: string;
};
