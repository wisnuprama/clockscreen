import { Dimensions } from "react-native";

export const fontSize = (size: number) => {
  const { width } = Dimensions.get("window");
  const guidelineBaseWidth = 375; // Example base width for scaling

  return (width / guidelineBaseWidth) * size;
};
