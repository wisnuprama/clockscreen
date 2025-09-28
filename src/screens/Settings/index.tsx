import React, { memo, useImperativeHandle, useState, forwardRef } from "react";
import { Modal, StyleSheet, Text, View, ScrollView } from "react-native";

import packageJson from "../../../package.json";
import { SettingToggleItem } from "./components/SettingToggleItem";
import {
  SettingsManager,
  withSettingsManager,
} from "../../modules/SettingsManager";

const Toggle = withSettingsManager({
  boolean: SettingToggleItem,
});

interface SettingsHandlers {
  open: () => void;
  close: () => void;
}

const SettingKeys = Object.keys(SettingsManager) as Array<
  keyof typeof SettingsManager
>;

type SettingsProps = {};

export const Settings = memo(
  forwardRef<SettingsHandlers, SettingsProps>((_, ref) => {
    const [modalVisible, setModalVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setModalVisible(true),
      close: () => setModalVisible(false),
    }));

    return (
      <Modal
        animationType="slide"
        visible={modalVisible}
        presentationStyle="formSheet"
        hardwareAccelerated
        allowSwipeDismissal
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <ScrollView stickyHeaderIndices={[0]} style={styles.modalView}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading1}>Settings</Text>
          </View>
          {SettingKeys.map((key) => {
            return <Toggle key={key} settingKey={key} />;
          })}
          <Footer />
        </ScrollView>
      </Modal>
    );
  })
);

Settings.displayName = "Settings(React.forwardRef)";

function Footer() {
  return (
    <View style={{ marginTop: 32 }}>
      <Text style={styles.heading2}>About</Text>
      <Text style={styles.text}>
        This is a simple clock application built for home screen display
        purposes, especially good for standby tablet.
      </Text>
      <Text style={styles.text}>Version: {packageJson.version}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  modalView: {
    paddingHorizontal: 42,
  },

  headerContainer: { backgroundColor: "#fff", paddingTop: 42 },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  heading1: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },

  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});
