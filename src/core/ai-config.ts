import { ref } from "vue";
import type {
  AIConfiguration,
  ConfigurationStatus,
} from "../types/ai-config.types";

export default function useAIConfiguration(config: AIConfiguration) {
  const configurationStatus = ref<ConfigurationStatus>("missing");

  async function checkConfiguration() {
    configurationStatus.value = "checking";

    try {
      const result = await config.isConfigured();

      if (result) {
        configurationStatus.value = "configured";
        return;
      }

      configurationStatus.value = "missing";
    } catch {
      configurationStatus.value = "missing";
    }
  }

  return {
    checkConfiguration,
    configurationStatus,
  };
}
