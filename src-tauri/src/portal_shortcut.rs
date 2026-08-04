use ashpd::desktop::{
    global_shortcuts::{BindShortcutsOptions, GlobalShortcuts, NewShortcut},
    CreateSessionOptions,
};
use futures_util::StreamExt;
use gtk::prelude::*;
use tauri::{Emitter, Manager};

pub async fn listen_for_shortcut(
    app: tauri::AppHandle,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    println!("Connecting to GlobalShortcuts portal");

    let portal = GlobalShortcuts::new().await?;

    println!("Portal version: {}", portal.version());

    // Portal shortcuts are session-scoped, so this session must remain alive
    // for as long as we want to recieve activations.
    let session = portal
        .create_session(CreateSessionOptions::default())
        .await?;

    let mut activations = portal.receive_activated().await?;

    let shortcuts = [NewShortcut::new("rewrite", "Open Grammar Assistant")];

    let request = portal
        .bind_shortcuts(&session, &shortcuts, None, BindShortcutsOptions::default())
        .await?;

    let response = request.response()?;

    for shortcut in response.shortcuts() {
        println!(
            "Bound shortcut: {} ({})",
            shortcut.id(),
            shortcut.trigger_description(),
        )
    }

    println!("Waiting for portal shortcut activation");

    while let Some(activation) = activations.next().await {
        println!("Portal shortcut activated: {}", activation.shortcut_id(),);

        println!("Activation options: {:#?}", activation.options(),);

        if activation.shortcut_id() != "rewrite" {
            continue;
        }

        // Rust owns the OS integrations, while Vue owns the clipboard and review state.
        app.emit("global-shortcut-triggered", ())?;

        // Wayland prevents applications from stealing focus.
        // The portal provides a one-time token proving this followed a user action.
        let activation_token = activation
            .options()
            .get("activation_token")
            .and_then(|value| value.downcast_ref::<&str>().ok())
            .map(str::to_owned);

        if let Some(window) = app.get_webview_window("main") {
            let window_for_main_thread = window.clone();

            // GTK window operations must run on GTK's main thread. 
            app.run_on_main_thread(move || {
                let Ok(gtk_window) = window_for_main_thread.gtk_window() else {
                    eprintln!("Could not access the GTK window");
                    return;
                };

                if let Some(token) = activation_token {
                    gtk_window.set_startup_id(&token);
                } else {
                    eprintln!("Shortcut activation did not include a token");
                }

                gtk_window.deiconify();
                gtk_window.show_all();
                gtk_window.present();

                println!("Grammar Assistant window presented");
            })?;
        } else {
            eprintln!("Could not find the main window");
        }
    }

    Ok(())
}
