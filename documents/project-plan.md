# Grammar Assistant Project Plan

## Project Goal

Build a lightweight desktop grammar assistant that reduces the friction of AI-assisted rewriting by letting a user copy text, press a shortcut, review an editable rewrite, and copy the result for manual pasting.

## Problem Statement

Using ChatGPT for small grammar fixes or tone rewrites requires too many repeated steps: opening a browser, pasting text, writing a prompt, copying the result, and returning to the original app. The desktop assistant should make that workflow feel immediate.

## Target Users

The primary user is the project owner, both as the first real user and as a learner building the app.

Likely future users are people who frequently write short messages, emails, docs, or comments and want quick grammar or tone rewrites without switching into a full chat interface.

## Success Criteria

The MVP is successful when:

- The app runs on Linux as a normal visible Tauri desktop app.
- The user can select text in another app and copy it with `Ctrl+C`.
- Pressing `Ctrl+Alt+G` opens the app and loads the current clipboard text.
- The app shows a small review window with the original text and an editable rewritten version.
- The user can choose `More Professional` or `More Concise`.
- The app can request an AI-powered rewrite from OpenAI using an API key supplied through the environment.
- The user can copy the edited rewrite and manually paste it into the original app.
- Input is limited to 500 characters.
- No text is saved.
- Text is sent over the network only when the user explicitly requests an AI rewrite.
- No API key is bundled, hardcoded, or committed to the repository.

## MVP Scope

The MVP should be intentionally small:

- Tauri + Vue 3 desktop app.
- Linux-first support.
- Fixed shortcut: `Ctrl+Alt+G`.
- Manual `Ctrl+C` before invoking the shortcut.
- Load the existing clipboard text when the shortcut opens the app.
- Editable review UI.
- Two rewrite presets:
  - `More Professional`
  - `More Concise`
- OpenAI-powered rewriting using `OPENAI_API_KEY`.
- Tiny deterministic local rewriter retained as development and test scaffolding.
- Copy the finished rewrite for manual pasting.
- No persistence of source text, rewritten text, or rewrite history.
- Tests for rewriter behavior and app state logic.

## MVP Scope Revision (August 2026)

The original MVP aimed to copy selected text and replace it automatically after rewriting. On Wayland, applications cannot reliably synthesize copy and paste shortcuts or move focus between unrelated applications without additional desktop-specific integration and permissions.

The MVP now uses this explicit clipboard workflow:

`Select → Ctrl+C → Ctrl+Alt+G → Rewrite → Copy → manually paste`

Automatic selection capture and replacement are deferred. This keeps the Linux MVP understandable and dependable while avoiding a large amount of Rust and desktop-environment-specific code.

OpenAI-powered rewriting is promoted into the MVP because AI-assisted grammar and tone rewriting is the product's central value. The existing deterministic rewriter remains useful as a development tool and stable test fixture, but it is not exposed as a user-facing fallback.

The OpenAI slice uses these agreed requirements:

- Read `OPENAI_API_KEY` from the application environment.
- Do not expose the API key to the Vue webview or persist it in the app.
- Make OpenAI requests through a narrow Rust/Tauri command boundary.
- Treat clicking `Rewrite` as consent to send the current text, with a permanent disclosure in the UI.
- Disable `Rewrite` and show a loading spinner while a request is active.
- Wait for the complete response rather than streaming partial output.
- Keep the original text unchanged when a request fails and offer `Retry` only.
- Start normally when the API key is missing, but disable `Rewrite` and show setup guidance.
- Prioritize a fast, low-cost model suitable for short constrained rewrites.
- Preserve the input language without adding language detection or a language selector.
- Keep regular tests offline and deterministic; use mocked English and Swedish cases.
- Keep live API smoke tests optional and separate from the default test command.

## Core Features

### AI Rewrite

- Send text only after the user explicitly requests a rewrite.
- Apply the selected `More Professional` or `More Concise` instruction.
- Correct grammar and clarity conservatively without adding new meaning or information.
- Respond in the same language as the input unless translation is explicitly requested.
- Return only the rewritten text, without headings, quotation marks, explanations, or commentary.
- Preserve names, facts, meaning, and important details.
- Keep the response within the 500-character limit.
- Return the complete response to the editable review UI.
- Show clear missing-key, loading, retry, and failure states.

### Deterministic Development Fixture

The local rewriter is not part of the user-facing AI failure flow. It remains available for development and deterministic tests, where it performs small transformations.

### More Professional

- Trim whitespace.
- Normalize spacing.
- Fix basic capitalization.
- Replace a few casual phrases, such as `hey` -> `hello`.

### More Concise

- Trim whitespace.
- Collapse repeated spaces.
- Remove simple filler words like `just`, `really`, and `very`.

### Review Flow

- View original text.
- Edit generated rewrite before accepting.
- Copy rewritten text.
- Manually paste the rewrite back into the original application.

## Future Enhancements

- Settings screen for entering and removing an API key.
- Secure credential storage.
- Configurable shortcuts.
- Background/tray mode.
- Cross-platform support for macOS and Windows.
- More rewrite modes.
- Custom instruction input.
- Automatic selected-text capture.
- Automatic replacement of the original selection.
- Better replacement reliability.
- Optional rewrite history, if privacy trade-offs are acceptable later.

## Non-Goals

For the MVP:

- No bundled or shared API key.
- No account system.
- No saved rewrite history.
- No configurable shortcut UI.
- No background tray lifecycle.
- No full cross-platform guarantee.
- No complex AI prompt management.
- No API-key settings screen or credential persistence.
- No user-facing deterministic rewrite fallback.
- No synthesized `Ctrl+C` or `Ctrl+V` input.
- No automatic replacement of text in another application.

## Technical Constraints

- Use Tauri.
- Use Vue 3 for the frontend.
- Linux is the first supported platform.
- Design with future cross-platform support in mind.
- Prefer deterministic, testable logic early.
- Treat clipboard and shortcut automation as integration behavior, not the first testing target.
- Limit network calls to explicit AI rewrite requests.
- Use user-provided OpenAI credentials; never hardcode, bundle, log, or commit API keys.
- Keep the API key and OpenAI request on the Rust side of the Tauri boundary.
- Keep the default automated test suite offline and deterministic.

## Design Principles

- Keep the MVP small.
- Learn by building thin vertical slices.
- Test pure behavior first.
- Make privacy obvious.
- Avoid hidden persistence.
- Prefer review-before-replace.
- Keep OS-specific behavior isolated.
- Do not hardcode secrets.

## Known Risks

- Global selected-text capture may be fragile on Linux, especially across Wayland/X11 differences.
- Replacing selected text through clipboard and simulated paste may behave differently across apps.
- Global shortcut handling may require permissions or platform-specific handling.
- Tauri desktop APIs may require Rust-side learning even with a Vue frontend.
- OpenAI integration needs careful API key storage, privacy messaging, and failure handling.

## Technical Direction

Start with the app logic before deep OS automation.

A good first implementation sequence would be:

1. Create a pure local rewriter module.
2. Write tests for `More Professional`, `More Concise`, empty input, whitespace, and the 500-character limit.
3. Build Vue app state around original text, selected mode, rewritten text, edited text, and accept/copy actions.
4. Add a basic review UI.
5. Add Tauri commands for clipboard read/write.
6. Add fixed global shortcut.
7. Wire the shortcut to load existing clipboard text and show the review window.
8. Add OpenAI-powered rewriting behind a dedicated service boundary.
9. Add clear loading, privacy, credential, and failure states.

## Milestones

### 1. Project Skeleton

Set up Tauri + Vue 3 + test tooling.

### 2. Local Rewriter

Define rewrite modes and test deterministic behavior.

### 3. Review UI

Build the visible app flow using manually entered text first.

### 4. Clipboard Integration

Load text the user has copied and copy rewritten text back to the clipboard.

### 5. Shortcut Flow

Register `Ctrl+Alt+G`, open the app, and populate the review flow from text the user already copied.

### 6. OpenAI Rewrite Integration

Use `OPENAI_API_KEY` through a narrow Rust boundary to request conservative, multilingual grammar and tone rewrites.

### 7. MVP Hardening

Handle missing credentials, loading, retryable API failures, empty text, long text, failed clipboard reads, and manual copying.
