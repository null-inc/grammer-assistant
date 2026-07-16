# Grammar Assistant Project Plan

## Project Goal

Build a lightweight desktop grammar assistant that reduces the friction of using ChatGPT-style rewriting by letting a user select text, press a shortcut, review an editable rewrite, and apply or copy the result.

## Problem Statement

Using ChatGPT for small grammar fixes or tone rewrites requires too many repeated steps: opening a browser, pasting text, writing a prompt, copying the result, and returning to the original app. The desktop assistant should make that workflow feel immediate.

## Target Users

The primary user is the project owner, both as the first real user and as a learner building the app.

Likely future users are people who frequently write short messages, emails, docs, or comments and want quick grammar or tone rewrites without switching into a full chat interface.

## Success Criteria

The MVP is successful when:

- The app runs on Linux as a normal visible Tauri desktop app.
- The user can select text in another app.
- Pressing `Ctrl+Alt+G` captures the selected text through a clipboard-based workflow.
- The app shows a small review window with the original text and an editable rewritten version.
- The user can choose `More Professional` or `More Concise`.
- The user can accept the edited rewrite and attempt to replace the original selected text.
- The user can copy the rewritten text as a fallback.
- Input is limited to 500 characters.
- No text is saved.
- No network calls are made in the MVP.

## MVP Scope

The MVP should be intentionally small:

- Tauri + Vue 3 desktop app.
- Linux-first support.
- Fixed shortcut: `Ctrl+Alt+G`.
- Clipboard-based selected text capture.
- Editable review UI.
- Two rewrite presets:
  - `More Professional`
  - `More Concise`
- Tiny deterministic local rewriter.
- Stateless behavior.
- Tests for rewriter behavior and app state logic.

## Core Features

The local rewriter should perform small deterministic transformations.

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
- Attempt replacement of the original selection.

## Future Enhancements

- OpenAI API integration.
- User-provided API key settings.
- Secure credential storage.
- Configurable shortcuts.
- Background/tray mode.
- Cross-platform support for macOS and Windows.
- More rewrite modes.
- Custom instruction input.
- Better replacement reliability.
- Optional rewrite history, if privacy trade-offs are acceptable later.

## Non-Goals

For the MVP:

- No OpenAI API calls.
- No bundled or shared API key.
- No account system.
- No saved rewrite history.
- No configurable shortcut UI.
- No background tray lifecycle.
- No full cross-platform guarantee.
- No complex AI prompt management.

## Technical Constraints

- Use Tauri.
- Use Vue 3 for the frontend.
- Linux is the first supported platform.
- Design with future cross-platform support in mind.
- Prefer deterministic, testable logic early.
- Treat clipboard and shortcut automation as integration behavior, not the first testing target.

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
- Future OpenAI integration needs careful API key storage.

## Technical Direction

Start with the app logic before deep OS automation.

A good first implementation sequence would be:

1. Create a pure local rewriter module.
2. Write tests for `More Professional`, `More Concise`, empty input, whitespace, and the 500-character limit.
3. Build Vue app state around original text, selected mode, rewritten text, edited text, and accept/copy actions.
4. Add a basic review UI.
5. Add Tauri commands for clipboard read/write.
6. Add fixed global shortcut.
7. Wire the shortcut to clipboard capture and review window behavior.
8. Add replacement attempt.

## Milestones

### 1. Project Skeleton

Set up Tauri + Vue 3 + test tooling.

### 2. Local Rewriter

Define rewrite modes and test deterministic behavior.

### 3. Review UI

Build the visible app flow using manually entered text first.

### 4. Clipboard Integration

Read selected text via clipboard workflow and copy rewritten text back.

### 5. Shortcut Flow

Register `Ctrl+Alt+G` and open/populate the review flow.

### 6. Accept Replacement

Attempt to paste the edited rewrite back into the original app.

### 7. MVP Hardening

Handle empty text, long text, failed clipboard reads, and replacement fallback.
