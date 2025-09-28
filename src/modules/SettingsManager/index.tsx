import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsSchema } from "./schema";
import type { SettingsManagerType } from "./types";
import { useEffect, useReducer } from "react";
import { makeObservable, observable, runInAction } from "mobx";

const StorageKey = "app_settings";

class SettingsManagerImpl {
  private cachedSettings: Map<string, any> = new Map();

  public isLoading = true;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
    });
    // Load settings from AsyncStorage
    this.loadSettings();
    // Initialize dynamic getters and setters
    this.init();
  }

  private loadSettings = async () => {
    try {
      const jsonString = await AsyncStorage.getItem(StorageKey);
      if (jsonString) {
        this.cachedSettings = new Map(Object.entries(JSON.parse(jsonString)));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

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
    return this.cachedSettings.get(key);
  }

  private idleCallbackHandle: number | null = null;
  private setItem(key: string, value: string | number | boolean): void {
    this.cachedSettings.set(key, value);

    // Notify watchers
    if (this.watchers.has(key)) {
      for (const callback of this.watchers.get(key)!) {
        try {
          callback();
        } catch (error) {
          console.error("Error in settings watcher callback:", error);
        }
      }
    }

    if (this.idleCallbackHandle !== null) {
      cancelIdleCallback(this.idleCallbackHandle);
    }
    // Persist to AsyncStorage
    this.idleCallbackHandle = requestIdleCallback(() => {
      AsyncStorage.setItem(
        StorageKey,
        JSON.stringify(Object.fromEntries(this.cachedSettings))
      ).catch((error) => {
        console.error("Failed to save settings:", error);
      });
    });
  }

  public keys() {
    return (
      Object.keys(SettingsSchema) as Array<keyof SettingsManagerType>
    ).filter((key) => !SettingsSchema[key].hidden);
  }

  private watchers = new Map<string, Set<() => void>>();

  public watch(key: keyof SettingsManagerType, callback: () => void) {
    if (!this.watchers.has(key)) {
      this.watchers.set(key, new Set());
    }
    this.watchers.get(key)!.add(callback);

    // Return an unsubscribe function to remove the watcher
    return () => {
      this.watchers.get(key)!.delete(callback);
    };
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

export function useSettings(key: keyof SettingsManagerType) {
  const [, forceRender] = useReducer((x) => x + 1, 0);

  // Subscribe to changes in the specific setting key
  useEffect(() => {
    const unsubscribe = SettingsManager.watch(key, () => {
      forceRender();
    });

    return () => {
      unsubscribe();
    };
  }, [key]);

  return SettingsManager[key];
}
