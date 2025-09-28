import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalTimer } from "./GlobalTimer";

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const callback = (timestamp: number) => {
      setTime(new Date(timestamp));
    };

    GlobalTimer.getInstance().subscribe(callback);
    return () => {
      GlobalTimer.getInstance().unsubscribe(callback);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.clock,
          {
            fontSize: fontSize(48),
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatTime(time)}
      </Text>
      <StatusBar style="auto" />
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
    fontSize: 48,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "#fff",
  },
});

const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const fontSize = (size: number) => {
  const { width } = Dimensions.get("window");
  const guidelineBaseWidth = 375; // Example base width for scaling

  return (width / guidelineBaseWidth) * size;
};
