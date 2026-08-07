const OPENAI_API_KEY_ENV: &str = "OPENAI_API_KEY";

fn has_api_key(value: Option<&str>) -> bool {
    value.is_some_and(|key| !key.trim().is_empty())
}

#[tauri::command]
pub fn is_openai_configured() -> bool {
    let api_key = std::env::var(OPENAI_API_KEY_ENV).ok();

    has_api_key(api_key.as_deref())
}

#[cfg(test)]
mod tests {
    use super::has_api_key;

    #[test]
    fn reports_missing_when_api_key_is_absent() {
        assert!(!has_api_key(None));
    }

    #[test]
    fn reports_configured_when_api_key_is_present() {
        assert!(has_api_key(Some("test-key")));
    }

    #[test]
    fn reports_missing_when_api_key_is_blank() {
        assert!(!has_api_key(Some("   ")));
    }
}