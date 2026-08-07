# Grammar Assistant

Grammar Assistant is a small Linux-first Tauri application for rewriting short
text with OpenAI. It keeps the user in control of the clipboard and never saves
source text, rewritten text, or rewrite history.

The MVP workflow is:

```text
Select → Ctrl+C → Ctrl+Alt+G → Rewrite → Copy → manually paste
```

## Features

- Fixed `Ctrl+Alt+G` global shortcut on Linux.
- Loads text already copied to the clipboard.
- `More Professional` and `More Concise` rewrite modes.
- Preserves the input language.
- Editable rewrite with the original text kept as a reference.
- 500-character input and output limit.
- User-supplied OpenAI API key kept on the Rust side of the Tauri boundary.
- No rewrite history or text persistence.

## Requirements

- Linux with an XDG Desktop Portal implementation that supports Global
  Shortcuts.
- Node.js and npm.
- A Rust toolchain.
- The platform packages listed in the
  [Tauri Linux prerequisites](https://v2.tauri.app/start/prerequisites/#linux).
- An OpenAI API key with API billing enabled.

Install the JavaScript dependencies with:

```sh
npm install
```

## OpenAI API key

The application reads `OPENAI_API_KEY` from its process environment. Never add
the key to source control and never prefix it with `VITE_`, because Vite exposes
`VITE_` variables to frontend JavaScript.

For Fish, export the key in the terminal that launches the application:

```fish
set -gx OPENAI_API_KEY 'your-api-key-here'
```

For Bash or Zsh:

```sh
export OPENAI_API_KEY='your-api-key-here'
```

For local Fish convenience, a file ending in `.local` is ignored by Git. For
example, create `secrets.fish.local` containing the Fish `set` command above,
then load it with:

```fish
source secrets.fish.local
```

Restart the application after adding or changing the key.

## Linux development

Run the offline test suite:

```sh
npm test
```

Run the source-quality checks:

```sh
npm run format:check
npm run lint
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
```

### Wayland global shortcut launch

On Wayland, running `npm run tauri dev` directly may not give the process an
application ID. The GlobalShortcuts portal then rejects registration with `An
app id is required`.

Build the debug binary and run it in an application-named systemd scope:

```sh
npm run tauri build -- --debug --no-bundle
systemd-run --user --scope --collect \
  --unit='app-com.leandrodasouza.grammer\x2dassistant-dev.scope' \
  ./src-tauri/target/debug/grammer-assistant
```

Run those commands from the same exported environment as `OPENAI_API_KEY`.
Close the existing application before reusing the fixed development scope name.
This built-binary workflow does not provide frontend hot reload.

## Build a Linux package

```sh
npm run tauri build
```

The MVP builds native `.deb` and `.rpm` packages beneath:

```text
src-tauri/target/release/bundle/
```

After installing a package, launch it through the desktop application entry so
the portal can associate the process with
`com.leandrodasouza.grammer-assistant`. The MVP still expects
`OPENAI_API_KEY` to be present in the launched process environment; an in-app
settings screen and secure credential storage are future work.

## Privacy

Text is sent to OpenAI only after the user clicks `Rewrite`. Clipboard text and
rewrite results are held in memory and are not saved by the application. The API
request uses `store: false`.

## MVP limitations

- Linux-first; macOS and Windows are not currently supported or tested.
- Fixed shortcut with no settings UI.
- API key configuration is environment-variable only.
- No tray/background lifecycle.
- No automatic copying of selected text or pasting the result.
