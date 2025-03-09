import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { router } from "expo-router";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ArrowLeftIcon } from "@/components/ui/icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Switch } from "@/components/ui/switch";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { MapPin } from "lucide-react-native";
import ProgressBar from "./components/progress-bar";

export default function OnboardingSettings() {
  const [location, setLocation] = useState("");
  const [privateAccount, setPrivateAccount] = useState(false);
  const [messageNotifications, setMessageNotifications] = useState(false);
  const [eventNotifications, setEventNotifications] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        const dataJson = await AsyncStorage.getItem("data");
        if (userID && dataJson) {
          const data = JSON.parse(dataJson);
          const user = data.Users.find((u: any) => u.id === userID);
          if (user) {
            setLocation(user.location || "");
            setPrivateAccount(user.privateAccount || false);
            setMessageNotifications(user.messageNotifications || false);
            setEventNotifications(user.eventNotifications || false);
          }
        } else {
          console.warn("User data not found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      const userID = await AsyncStorage.getItem("userID");
      const dataJson = await AsyncStorage.getItem("data");
      if (userID && dataJson) {
        const data = JSON.parse(dataJson);
        const updatedUsers = data.Users.map((user: any) =>
          user.id === userID
            ? {
                ...user,
                location,
                privateAccount,
                messageNotifications,
                eventNotifications,
              }
            : user
        );
        const updatedData = { ...data, Users: updatedUsers };
        await AsyncStorage.setItem("data", JSON.stringify(updatedData));
      }
      router.push("/availability");
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  return (
    <Box className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <ProgressBar stepNumber={2} />
        <Fab
          placement="top left"
          size="lg"
          onPress={() => router.back()}
          className="border border-black bg-transparent p-2 mt-4 active:bg-transparent focus:bg-transparent"
        >
          <FabIcon
            as={ArrowLeftIcon}
            onPress={() => router.back()}
            className="text-black"
          />
        </Fab>
        <Center className="flex-1 bg-white p-10 mt-5">
          <VStack space="4xl" className="w-full mt-5">
            <Heading size="3xl" className="text-left">
              Account Settings
            </Heading>
            <VStack space="lg" className="w-full">
              <Heading size="xl" className="text-left">
                Notifications
              </Heading>
              <HStack space="lg">
                <VStack
                  className="flex-1"
                  space="sm"
                  style={{ maxWidth: "75%" }}
                >
                  <Text size="lg">Events</Text>
                  <Text size="sm">
                    Turns on push notifications for all events you RSVP to so
                    you are notified of all event updates.
                  </Text>
                </VStack>
                <Switch
                  size="md"
                  value={eventNotifications}
                  onValueChange={setEventNotifications}
                  trackColor={{ true: "#fb9d4b", false: "#f1f2f2" }}
                  thumbColor={eventNotifications ? "#FFFFFF" : "#FFFFFF"}
                />
              </HStack>
              <HStack space="xl">
                <VStack
                  className="flex-1"
                  space="sm"
                  style={{ maxWidth: "75%" }}
                >
                  <Text size="lg">Messages</Text>
                  <Text size="sm">
                    Get notifications for new messages from friends and groups.
                  </Text>
                </VStack>
                <Switch
                  size="md"
                  value={messageNotifications}
                  onValueChange={setMessageNotifications}
                  trackColor={{ true: "#fb9d4b", false: "#f1f2f2" }}
                  thumbColor={messageNotifications ? "#FFFFFF" : "#FFFFFF"}
                />
              </HStack>
            </VStack>
            <VStack space="xl">
              <Heading size="xl" className="text-left">
                Privacy and Security
              </Heading>
              <VStack space="xs">
                <Text size="xl">Location</Text>
                <Input
                  variant="outline"
                  size="xl"
                  isRequired={true}
                  className="pr-2"
                >
                  <InputField value={location} onChangeText={setLocation} />
                  <InputSlot>
                    <InputIcon as={MapPin} />
                  </InputSlot>
                </Input>
              </VStack>
              <HStack space="lg">
                <VStack className="flex-1" style={{ maxWidth: "75%" }}>
                  <Text size="lg">Private Account</Text>
                  <Text size="sm">
                    A private account hides your bio and profile picture from
                    other users.
                  </Text>
                </VStack>
                <Switch
                  size="md"
                  value={privateAccount}
                  onValueChange={setPrivateAccount}
                  trackColor={{ true: "#fb9d4b", false: "#f1f2f2" }}
                  thumbColor={!privateAccount ? "#FFFFFF" : "#FFFFFF"}
                />
              </HStack>
            </VStack>
            <Button
              variant="solid"
              size="xl"
              className="mt-5"
              onPress={saveSettings}
            >
              <ButtonText>Save</ButtonText>
            </Button>
          </VStack>
        </Center>
      </ScrollView>
    </Box>
  );
}
