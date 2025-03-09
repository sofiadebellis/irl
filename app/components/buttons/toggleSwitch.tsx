import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ToggleSwitchProps {
  isEventActive: boolean;
  setIsEventActive: (value: boolean) => void;
  isPrivateActive: boolean;
  setIsPrivateActive: (value: boolean) => void;
  className?: string;
}

const ToggleSwitch = ({
  isEventActive,
  setIsEventActive,
  isPrivateActive,
  setIsPrivateActive,
  className,
}: ToggleSwitchProps) => {
  const toggleEvent = () => {
    setIsEventActive(true);
    setIsPrivateActive(false);
  };

  const togglePrivate = () => {
    setIsEventActive(false);
    setIsPrivateActive(true);
  };

  return (
    <View style={styles.container} className={className}>
      <TouchableOpacity
        onPress={toggleEvent}
        style={[
          styles.button,
          isEventActive ? styles.activeButton : styles.inactiveButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            isEventActive ? styles.activeText : styles.inactiveText,
          ]}
        >
          Event Chats
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={togglePrivate}
        style={[
          styles.button,
          isPrivateActive ? styles.activeButton : styles.inactiveButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            isPrivateActive ? styles.activeText : styles.inactiveText,
          ]}
        >
          Private Chats
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
