// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg(target_os = "linux")]
mod portal_shortcut;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(target_os = "linux")]
            let app_handle = _app.handle().clone();

            #[cfg(target_os = "linux")]
            tauri::async_runtime::spawn(async {
                if let Err(error) = portal_shortcut::listen_for_shortcut(app_handle).await {
                    eprintln!("Global shortcut portal failed: {error}");
                }
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
