import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ToggleSwitchProps {
  isFirstActive: boolean;
  setIsFirstActive: (value: boolean) => void;
  isSecondActive: boolean;
  setIsSecondActive: (value: boolean) => void;
  firstToggleLabel: string;
  secondToggleLabel: string;
  className?: string;
}

const ToggleSwitch = ({
  isFirstActive,
  setIsFirstActive,
  isSecondActive,
  setIsSecondActive,
  firstToggleLabel,
  secondToggleLabel,
  className,
}: ToggleSwitchProps) => {
  const toggleFirst = () => {
    setIsFirstActive(true);
    setIsSecondActive(false);
  };

  const toggleSecond = () => {
    setIsFirstActive(false);
    setIsSecondActive(true);
  };

  return (
    <View style={styles.container} className={className}>
      <TouchableOpacity
        onPress={toggleFirst}
        style={[
          styles.button,
          isFirstActive ? styles.activeButton : styles.inactiveButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            isFirstActive ? styles.activeText : styles.inactiveText,
          ]}
        >
          {firstToggleLabel}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={toggleSecond}
        style={[
          styles.button,
          isSecondActive ? styles.activeButton : styles.inactiveButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            isSecondActive ? styles.activeText : styles.inactiveText,
          ]}
        >
          {secondToggleLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1.8,
    borderColor: "black",
    borderRadius: 20,
    height: 45,
    // width: "100%",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    height: "100%",
    width: "100%",
  },
  activeButton: {
    backgroundColor: "black",
    borderRadius: 18,
  },
  inactiveButton: {
    backgroundColor: "white",
  },
  activeText: {
    color: "white",
  },
  inactiveText: {
    color: "black",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default ToggleSwitch;
