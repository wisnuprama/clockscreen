import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Vibration,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalSecondTimer } from "../utils/GlobalTimer";
import { Settings } from "./Settings";
import { SettingsManager, useSettings } from "../modules/SettingsManager";
import { formatTime } from "../utils/formatTime";
import { observer } from "mobx-react-lite";
import { getMaxClockString } from "../utils/getMaxClockString";
import { fontSize } from "../utils/fontSize";

export default observer(function App() {
  const settingsRef = React.useRef<{ open: () => void; close: () => void }>(
    null
  );

  if (SettingsManager.isLoading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Setting up...</Text>
      </View>
    );
  }

  return (
    <>
      <Pressable
        onLongPress={() => {
          settingsRef.current?.open();
          Vibration.vibrate(100);
        }}
        style={styles.container}
      >
        <View>
          <Clock />
        </View>
        <DateDisplay />
      </Pressable>
      <StatusBar style="auto" />
      <Settings ref={settingsRef} />
    </>
  );
});

function Clock() {
  const [time, setTime] = useState(new Date());

  const showSeconds = useSettings("showSeconds");
  const is24Hour = useSettings("is24Hour");

  useEffect(() => {
    const callback = (timestamp: number) => {
      setTime(new Date(timestamp));
    };

    GlobalSecondTimer.subscribe(callback);
    return () => {
      GlobalSecondTimer.unsubscribe(callback);
    };
  }, []);

  // Calculate max width for clock text (e.g., "23:59:59")
  const maxClockString = getMaxClockString({ showSeconds, is24Hour });
  // Use a monospaced font and fixed width
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={[
          styles.clock,
          {
            fontSize: fontSize((1 / maxClockString.length) * 500), // Adjust multiplier as needed
          },
        ]}
        numberOfLines={1}
      >
        {formatTime(time, { showSeconds, is24Hour })}
      </Text>
    </View>
  );
}

/**
 * TODO: support dynamic locale based on device settings
 */
function DateDisplay() {
  const [date, setDate] = useState(new Date());

  const showTodayDate = useSettings("showTodayDate");

  useEffect(() => {
    if (!showTodayDate) {
      return;
    }

    const callback = (timestamp: number) => {
      setDate(new Date(timestamp));
    };

    GlobalSecondTimer.subscribe(callback);
    return () => {
      GlobalSecondTimer.unsubscribe(callback);
    };
  }, []);

  if (!showTodayDate) {
    return null;
  }

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
      }}
    >
      <Text
        style={[
          styles.clock,
          {
            fontSize: fontSize(24),
          },
        ]}
        numberOfLines={1}
      >
        {Intl.DateTimeFormat("en-sg", { dateStyle: "medium" }).format(date)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  clock: {
    letterSpacing: 2,
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    // fontFamily is set dynamically in Clock for platform compatibility
  },
});
