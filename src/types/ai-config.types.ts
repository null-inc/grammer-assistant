export interface AIConfiguration {
  isConfigured(): Promise<boolean>;
}

export type ConfigurationStatus = "checking" | "configured" | "missing";
