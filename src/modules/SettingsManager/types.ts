import { SettingsSchema } from "./schema";

// Dynamically generate type for SettingsManager based on SettingsSchema
export type SettingsManagerType = {
  [K in keyof typeof SettingsSchema]: (typeof SettingsSchema)[K]["default"];
};
