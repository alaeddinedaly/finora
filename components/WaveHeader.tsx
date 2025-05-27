// components/WaveHeader.js
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const WaveHeader = () => {
  return (
    <View style={styles.container}>
      <Svg
        height="200"
        width={width}
        viewBox={`0 0 ${width} 200`}
        style={styles.svg}
      >
        <Path
          fill="#5c9fef"
          d={`
    M0,0
    H${width}
    V100
    C${width * 0.75},160 ${width * 0.25},20 -50,250
    Z
  `}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF7A5C",
  },
  svg: {
    position: "absolute",
    top: 0,
  },
});

export default WaveHeader;
