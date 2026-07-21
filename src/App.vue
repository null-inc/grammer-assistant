<script setup lang="ts">
import { computed, ref } from "vue";
// import { invoke } from "@tauri-apps/api/core";
import { createReviewState } from "./core/review-state";
import { ReviewState } from "./types/review-state.types";
import { rewriteTextSetting } from "./types/rewriter.types";

const reviewState = ref<ReviewState | null>(null);
const rewriteSetting = ref<rewriteTextSetting>("more-professional");
const editedText = ref("");
const userInput = ref("");

const activeText = computed({
  get() {
    return reviewState.value ? editedText.value : userInput.value;
  },
  set(value: string) {
    if (reviewState.value) {
      editedText.value = value;
      return;
    }

    userInput.value = value;
  },
});

function onSubmit() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  // greetMsg.value = await invoke("greet", { name: name.value });
  reviewState.value = createReviewState(userInput.value, rewriteSetting.value);
  editedText.value = reviewState.value.rewrittenText;
}

function handleCopy() {}
</script>

<template>
  <main class="app-shell">
    <section class="composer">
      <div class="app-heading">
        <p class="eyebrow">Grammar Assistant</p>
        <h1>AI Rewrite</h1>
      </div>

      <form class="rewrite-form" @submit.prevent="onSubmit">
        <label class="field-label" for="review-text">
          {{ reviewState ? "Rewrite" : "Selected text" }}
        </label>
        <textarea
          id="review-text"
          v-model="activeText"
          class="text-input"
          maxlength="500"
          rows="4"
        ></textarea>

        <div class="form-footer">
          <label class="setting-field" for="rewrite-setting">
            <span class="field-label">Mode</span>
            <select id="rewrite-setting" v-model="rewriteSetting">
              <option value="more-professional">More Professional</option>
              <option value="more-concise">More Concise</option>
            </select>
          </label>

          <p class="character-count">{{ activeText.length }} / 500</p>

          <div class="action-buttons">
            <button class="primary-action" type="submit">Rewrite</button>
            <button
              class="secondary-action"
              type="button"
              @click.prevent="handleCopy"
            >
              Copy
            </button>
          </div>
        </div>
      </form>
    </section>

    <section v-if="reviewState" class="review-panel">
      <h2>Original reference</h2>
      <p class="original-text">{{ reviewState.originalText }}</p>
    </section>
  </main>
</template>

<style>
:root {
  font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #2d2a24;
  background: #efe4c9;

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
  background:
    radial-gradient(
      circle at top left,
      rgba(255, 255, 255, 0.58),
      transparent 32%
    ),
    linear-gradient(135deg, #efe4c9, #e7dcc2);
}

button,
select,
textarea {
  font: inherit;
}

.app-shell {
  width: min(420px, 100%);
  min-height: 100vh;
  margin: 0 auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start;
}

.composer,
.review-panel {
  border: 1px solid #c9bea7;
  border-radius: 8px;
  background:
    linear-gradient(90deg, rgba(190, 83, 65, 0.18) 32px, transparent 33px),
    repeating-linear-gradient(
      to bottom,
      rgba(255, 250, 235, 0.9) 0,
      rgba(255, 250, 235, 0.9) 23px,
      rgba(99, 129, 153, 0.13) 24px
    ),
    #f6ecd4;
  box-shadow:
    0 12px 26px rgba(74, 56, 32, 0.16),
    inset 0 1px rgba(255, 255, 255, 0.7);
}

.composer {
  padding: 14px 14px 14px 44px;
}

.app-heading {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 12px;
}

h1 {
  margin: 0;
  color: #4b3524;
  font-size: 1.05rem;
  line-height: 1.2;
  letter-spacing: 0;
}

h2 {
  margin: 0 0 6px;
  color: #6a4c35;
  font-size: 0.82rem;
  line-height: 1.3;
  letter-spacing: 0;
}

.eyebrow,
.field-label,
.character-count {
  margin: 0;
  color: #725f4b;
  font-size: 0.75rem;
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
  gap: 8px;
}

.text-input,
select,
button {
  border-radius: 6px;
  border: 1px solid #bcae91;
  color: #2d2a24;
  background-color: rgba(255, 249, 231, 0.86);
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background-color 0.2s;
}

.text-input {
  width: 100%;
  min-height: 104px;
  padding: 10px;
  line-height: 1.5;
  resize: vertical;
}

.text-input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 95, 138, 0.16);
}

.form-footer {
  display: grid;
  grid-template-columns: minmax(140px, 1fr) auto auto;
  gap: 8px;
  align-items: end;
}

.setting-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

select {
  appearance: none;
  min-height: 34px;
  padding: 0 30px 0 10px;
  background-image:
    linear-gradient(45deg, transparent 50%, #5b4a35 50%),
    linear-gradient(135deg, #5b4a35 50%, transparent 50%);
  background-position:
    calc(100% - 16px) 14px,
    calc(100% - 11px) 14px;
  background-repeat: no-repeat;
  background-size:
    5px 5px,
    5px 5px;
  cursor: pointer;
}

.character-count {
  align-self: center;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

button {
  min-width: 76px;
  min-height: 34px;
  padding: 0 12px;
  font-weight: 700;
  cursor: pointer;
}

.primary-action {
  border-color: #8d7350;
  color: #fff8e7;
  background: linear-gradient(180deg, #9a805c, #806642);
  box-shadow:
    inset 0 1px rgba(255, 255, 255, 0.18),
    0 2px 6px rgba(93, 69, 38, 0.18);
}

.primary-action:hover {
  border-color: #765f40;
  background: linear-gradient(180deg, #8c704c, #725836);
}

.primary-action:active {
  background: #604c33;
}

.secondary-action {
  border-color: #bcae91;
  color: #5b4a35;
  background: rgba(255, 249, 231, 0.86);
}

.secondary-action:hover {
  border-color: #9d8c6d;
  background: rgba(250, 239, 213, 0.96);
}

.secondary-action:active {
  background: #eadbbd;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 95, 138, 0.2);
}

.review-panel {
  padding: 12px 14px 12px 44px;
}

.original-text {
  margin: 0;
  color: #514534;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

@media (max-width: 680px) {
  .app-shell {
    padding: 10px;
  }

  .composer {
    padding: 14px;
  }

  .form-footer {
    grid-template-columns: 1fr;
  }

  .character-count {
    justify-self: start;
  }

  .action-buttons {
    justify-content: stretch;
  }

  .action-buttons button {
    flex: 1;
  }
}
</style>
