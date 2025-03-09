import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { router } from "expo-router";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ArrowLeftIcon } from "@/components/ui/icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Switch } from "@/components/ui/switch";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { MapPin } from "lucide-react-native";
import { Box } from "@/components/ui/box";

export default function EditProfile() {
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
      router.push("/profile");
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  return (
    <Box style={{ flex: 1, backgroundColor: "#FFFFFF" }} className="h-full">
      <ScrollView className="flex-1 relative">
        <Fab
          placement="top left"
          size="lg"
          onPress={() => router.back()}
          className="border border-black bg-white p-2 mt-5 active:bg-white focus:bg-white"
          style={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: "white",
            height: 50,
            width: 50,
          }}
        >
          <FabIcon
            as={ArrowLeftIcon}
            onPress={() => router.back()}
            size="xl"
            className="text-black"
          />
        </Fab>
        <Center className="flex-1 bg-white mt-10">
          <Box className="w-full">
            <VStack space="lg" className="ml-10 mr-10">
              <Heading size="3xl" className="text-left ml-10 mt-2">
                Account Settings
              </Heading>

              <VStack space="xl" className="w-full mt-5">
                <Heading size="2xl" className="text-left">
                  Notifications
                </Heading>
                <HStack space="lg">
                  <VStack className="flex-1" space="md">
                    <Text size="xl">Events</Text>
                    <Text size="md">
                      Turns on push notifications for all events you RSVP to so
                      you are notified of all event updates.
                    </Text>
                  </VStack>
                  <Switch
                    size="lg"
                    value={eventNotifications}
                    onValueChange={setEventNotifications}
                    trackColor={{ true: "#fb9d4b" }}
                  />
                </HStack>
                <HStack space="xl">
                  <VStack className="flex-1" space="md">
                    <Text size="2xl">Messages</Text>
                    <Text size="md">
                      Get notifications for new messages from friends and
                      groups.
                    </Text>
                  </VStack>
                  <Switch
                    size="lg"
                    value={messageNotifications}
                    onValueChange={setMessageNotifications}
                    trackColor={{ true: "#fb9d4b" }}
                  />
                </HStack>
              </VStack>
              <VStack space="xl">
                <Heading size="xl" className="text-left mt-5">
                  Privacy and Security
                </Heading>
                <VStack space="md">
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
                  <VStack className="flex-1">
                    <Text size="xl">Private Account</Text>
                    <Text size="md">
                      A private account hides your bio and profile picture from
                      other users.
                    </Text>
                  </VStack>
                  <Switch
                    size="lg"
                    value={privateAccount}
                    onValueChange={setPrivateAccount}
                    trackColor={{ true: "#fb9d4b" }}
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
          </Box>
        </Center>
      </ScrollView>
    </Box>
  );
}
