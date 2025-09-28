import React, {
  memo,
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";

import packageJson from "../../../package.json";
import { SettingToggleItem } from "./components/SettingToggleItem";
import {
  SettingsManager,
  useSettings,
  withSettingsManager,
} from "../../modules/SettingsManager";

const Toggle = withSettingsManager({
  boolean: SettingToggleItem,
});

interface SettingsHandlers {
  open: () => void;
  close: () => void;
}

type SettingsProps = {};

export const Settings = memo(
  forwardRef<SettingsHandlers, SettingsProps>((_, ref) => {
    const [modalVisible, setModalVisible] = useState(false);

    const showIntroduction = useSettings("showIntroduction");

    useLayoutEffect(() => {
      if (showIntroduction) {
        Alert.alert(
          "Welcome to Clock Screen App",
          "You can open settings by long pressing the clock.",
          [{ text: "Got it", onPress: () => {} }]
        );
      }
    }, [showIntroduction]);

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
          {SettingsManager.keys().map((key) => {
            return <Toggle key={key} settingKey={key} />;
          })}
          <Footer />
        </ScrollView>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{
            width: "50%",
            padding: 16,
            backgroundColor: "#eee",
            borderRadius: 25,
            alignSelf: "center",
            marginVertical: 16,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Close
          </Text>
        </TouchableOpacity>
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

  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 42,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
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
