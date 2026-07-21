import { ReviewState } from "../types/review-state.types";
import { rewriteText } from "./rewriter";
import { rewriteTextSetting } from "../types/rewriter.types";

export function createReviewState(
  userInput: string,
  selectedSetting: rewriteTextSetting,
): ReviewState {
  const { setting, response } = rewriteText(userInput, selectedSetting);

  return {
    originalText: userInput,
    selectedSetting: setting,
    rewrittenText: response,
    errorMessage: "",
  };
}
