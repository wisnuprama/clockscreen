import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

type SettingToggleItemProps = {
  label: string;
  value: boolean;
  description?: string;
  onChange: (newValue: boolean) => void;
};

export function SettingToggleItem(props: SettingToggleItemProps) {
  return (
    <View style={styles.settings_itemContainer}>
      <View style={styles.settings_itemContent}>
        <Text style={styles.heading2} numberOfLines={1}>
          {props.label}
        </Text>
        <Switch value={props.value} onValueChange={props.onChange} />
      </View>
      {props.description ? (
        <Text style={styles.description}>{props.description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },

  settings_itemContainer: {
    marginBottom: 16,
    flexDirection: "column",
  },

  settings_itemContent: {
    flexDirection: "row",
  },

  description: {
    fontSize: 16,
    marginBottom: 8,
  },
});
