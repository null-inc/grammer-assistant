const OPENAI_API_KEY_ENV: &str = "OPENAI_API_KEY";

use serde::Deserialize;

#[derive(Debug, Deserialize, PartialEq)]
#[serde(rename_all = "kebab-case")]
pub enum RewriteSetting {
    MoreProfessional,
    MoreConcise
}

#[derive(Debug, Deserialize)]
pub struct  RewriteRequest {
    text: String,
    setting: RewriteSetting
}


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
    use super::{has_api_key, RewriteRequest, RewriteSetting};

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
    #[test]
    fn deserializes_professional_rewrite_request() {
        let request: RewriteRequest = serde_json::from_value(
            serde_json::json!({
                "text": "hej jag behöver hjälp",
                "setting": "more-professional"
            }),
        )
        .expect("request should deserialize");

        assert_eq!(request.text, "hej jag behöver hjälp");
        assert_eq!(
            request.setting,
            RewriteSetting::MoreProfessional
        )
    }
}