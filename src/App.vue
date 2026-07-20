<script setup lang="ts">
import { ref } from "vue";
// import { invoke } from "@tauri-apps/api/core";
import { createReviewState } from "./core/review-state";
import { ReviewState } from "./types/review-state.types";
import { rewriteTextSetting } from "./types/rewriter.types";

const reviewState = ref<ReviewState | null>(null);
const rewriteSetting = ref<rewriteTextSetting>("more-professional");
const editedText = ref("");
const userInput = ref("");

function onSubmit() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  // greetMsg.value = await invoke("greet", { name: name.value });
  reviewState.value = createReviewState(userInput.value, rewriteSetting.value);
  editedText.value = reviewState.value.rewrittenText;
}
</script>

<template>
  <main class="app-shell">
    <section class="composer">
      <div class="app-heading">
        <p class="eyebrow">Grammar Assistant</p>
        <h1>Quick rewrite review</h1>
      </div>

      <form class="rewrite-form" @submit.prevent="onSubmit">
        <label class="field-label" for="user-input">Selected text</label>
        <textarea
          id="user-input"
          v-model="userInput"
          class="text-input"
          maxlength="500"
          rows="5"
        ></textarea>

        <div class="form-footer">
          <label class="setting-field" for="rewrite-setting">
            <span class="field-label">Mode</span>
            <select id="rewrite-setting" v-model="rewriteSetting">
              <option value="more-professional">More Professional</option>
              <option value="more-concise">More Concise</option>
            </select>
          </label>

          <p class="character-count">{{ userInput.length }} / 500</p>

          <button type="submit">Rewrite</button>
        </div>
      </form>
    </section>

    <section v-if="reviewState" class="review-panel">
      <article class="review-column">
        <h2>Original</h2>
        <p class="original-text">{{ reviewState.originalText }}</p>
      </article>

      <article class="review-column">
        <h2>Rewrite</h2>
        <textarea
          id="edited-text"
          v-model="editedText"
          class="text-input edited-output"
          name="edited-text"
        ></textarea>
      </article>
    </section>

    <section v-else class="empty-state">
      <p>Paste or type a short text sample to start reviewing.</p>
    </section>
  </main>
</template>

<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #1c2430;
  background: #f4f7f8;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
select,
textarea {
  font: inherit;
}

.app-shell {
  width: min(920px, 100%);
  min-height: 100vh;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.composer,
.review-panel,
.empty-state {
  border: 1px solid #d9e3e7;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(32, 52, 66, 0.08);
}

.composer {
  padding: 24px;
}

.app-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  color: #14202b;
  font-size: 1.65rem;
  line-height: 1.2;
  letter-spacing: 0;
}

h2 {
  margin: 0 0 12px;
  color: #24313d;
  font-size: 0.95rem;
  line-height: 1.3;
  letter-spacing: 0;
}

.eyebrow,
.field-label,
.character-count {
  margin: 0;
  color: #657583;
  font-size: 0.82rem;
  line-height: 1.4;
}

.eyebrow,
.field-label {
  font-weight: 700;
}

.eyebrow {
  text-transform: uppercase;
}

.rewrite-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.text-input,
select,
button {
  border-radius: 8px;
  border: 1px solid #cbd8de;
  color: #182532;
  background-color: #ffffff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background-color 0.2s;
}

.text-input {
  width: 100%;
  min-height: 132px;
  padding: 14px;
  resize: vertical;
}

.text-input:focus,
select:focus {
  border-color: #257b87;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 123, 135, 0.14);
}

.form-footer {
  display: grid;
  grid-template-columns: minmax(190px, 1fr) auto auto;
  gap: 12px;
  align-items: end;
}

.setting-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

select {
  min-height: 42px;
  padding: 0 36px 0 12px;
  cursor: pointer;
}

.character-count {
  align-self: center;
  white-space: nowrap;
}

button {
  min-height: 42px;
  padding: 0 18px;
  border-color: #257b87;
  color: #ffffff;
  background: #257b87;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  border-color: #1d6570;
  background: #1d6570;
}

button:active {
  background: #164f58;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 123, 135, 0.18);
}

.review-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.review-column {
  min-width: 0;
  padding: 20px;
}

.review-column + .review-column {
  border-left: 1px solid #d9e3e7;
}

.original-text {
  min-height: 132px;
  margin: 0;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #e1e9ed;
  color: #2f3d49;
  background: #f7fafb;
  white-space: pre-wrap;
}

.edited-output {
  display: block;
}

.empty-state {
  padding: 18px 20px;
  color: #657583;
}

.empty-state p {
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #edf3f5;
    background: #10171d;
  }

  .composer,
  .review-panel,
  .empty-state {
    border-color: #2c3a43;
    background: #172128;
    box-shadow: none;
  }

  h1,
  h2 {
    color: #f1f6f7;
  }

  .eyebrow,
  .field-label,
  .character-count,
  .empty-state {
    color: #98a8b3;
  }

  .text-input,
  select {
    border-color: #3a4a55;
    color: #edf3f5;
    background-color: #10171d;
  }

  .original-text {
    border-color: #2c3a43;
    color: #d9e4e8;
    background: #121c22;
  }

  .review-column + .review-column {
    border-color: #2c3a43;
  }

  button,
  button:hover,
  button:active {
    color: #ffffff;
  }
}

@media (max-width: 680px) {
  .app-shell {
    padding: 20px 14px;
  }

  .composer {
    padding: 18px;
  }

  .form-footer,
  .review-panel {
    grid-template-columns: 1fr;
  }

  .character-count {
    justify-self: start;
  }

  .review-column + .review-column {
    border-top: 1px solid #d9e3e7;
    border-left: 0;
  }
}

@media (prefers-color-scheme: dark) and (max-width: 680px) {
  .review-column + .review-column {
    border-color: #2c3a43;
  }
}
</style>
