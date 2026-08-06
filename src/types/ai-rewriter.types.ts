import type { rewriteTextSetting } from "./rewriter.types";

export type RewriteRequest = {
  text: string;
  setting: rewriteTextSetting;
};

export interface AIRewriter {
  rewrite(request: RewriteRequest): Promise<string>;
}
