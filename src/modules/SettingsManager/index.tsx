import { Settings as RNSettings } from "react-native";
import { SettingsSchema } from "./schema";
import type { SettingsManagerType } from "./types";
import { useReducer } from "react";

class SettingsManagerImpl {
  constructor() {
    this.init();
  }

  private init() {
    const self = this;
    // Automatically generate static getters and setters for each key in SettingsSchema
    type SchemaType = typeof SettingsSchema;
    for (const key of Object.keys(SettingsSchema)) {
      Object.defineProperty(self, key, {
        get() {
          const schema = SettingsSchema as SchemaType;
          const value = self.getItem(key);
          const expectedType = schema[key as keyof SchemaType].type;
          if (typeof value === expectedType) {
            return value;
          }
          return schema[key as keyof SchemaType].default;
        },
        set(val: any) {
          const schema = SettingsSchema as SchemaType;
          const { validate } = schema[key as keyof SchemaType];
          if (typeof validate === "function") {
            validate(val);
          }

          self.setItem(key, val);
        },
        enumerable: true,
        configurable: true,
      });
    }
  }

  private getItem(key: string): unknown {
    return RNSettings.get(key);
  }

  private setItem(key: string, value: string | number | boolean): void {
    return RNSettings.set({
      [key]: value,
    });
  }

  public keys() {
    return Object.keys(SettingsSchema) as Array<keyof SettingsManagerType>;
  }
}

const SettingsManager =
  new SettingsManagerImpl() as unknown as SettingsManagerImpl &
    SettingsManagerType;

export { SettingsManager };

type SettingComponentProps = {
  label: string;
  onChange: (newValue: boolean) => void;
  value: boolean;
  description: string;
};

export function withSettingsManager(Components: {
  boolean: React.ComponentType<SettingComponentProps>;
}) {
  return (props: { settingKey: keyof SettingsManagerType }) => {
    const [, forceRender] = useReducer((x) => x + 1, 0);

    const onChange = (newValue: boolean) => {
      // Update the SettingsManager value
      try {
        SettingsManager[props.settingKey] = newValue;
        forceRender();
      } catch (error) {
        console.error(`Failed to update setting ${props.settingKey}:`, error);
      }
    };

    console.log("Rendering setting for key:", props.settingKey, SettingsSchema);

    const fieldSchema = SettingsSchema[props.settingKey];

    const label = fieldSchema.label || props.settingKey;
    const description = fieldSchema.description || "";

    const Input = Components[fieldSchema.type as keyof typeof Components];

    return (
      <Input
        label={label}
        onChange={onChange}
        value={SettingsManager[props.settingKey]}
        description={description}
      />
    );
  };
}
