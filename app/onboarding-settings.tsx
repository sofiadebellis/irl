import React, { useState, useEffect, useRef } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
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
import { Icon } from "@/components/ui/icon";
import { MapPin } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import ProgressBar from "./components/progress-bar";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "@/helpers";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";

export default function Settings() {
  const [location, setLocation] = useState({});
  const [privateAccount, setPrivateAccount] = useState(false);
  const [messageNotifications, setMessageNotifications] = useState(false);
  const [eventNotifications, setEventNotifications] = useState(false);
  const ref = useRef<any>();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        const dataJson = await AsyncStorage.getItem("data");
        if (userID && dataJson) {
          const data = JSON.parse(dataJson);
          const user = data.Users.find((u: any) => u.id === userID);
          if (user) {
            setLocation(user.location || {});
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
            : user,
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
    <Box className="h-full bg-white pb-14">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white h-full"
      >
        <ProgressBar stepNumber={2} />
        <ScrollView className="flex-1" keyboardShouldPersistTaps="always">
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
                  <Heading size="xl" className="text-left">
                    Notifications
                  </Heading>
                  <HStack space="lg">
                    <VStack className="flex-1" space="md">
                      <Text size="xl">Events</Text>
                      <Text size="md">
                        Turns on push notifications for all events you RSVP to
                        so you are notified of all event updates.
                      </Text>
                    </VStack>
                    <Switch
                      size="lg"
                      value={eventNotifications}
                      onValueChange={setEventNotifications}
                      trackColor={{ true: "#fb9d4b" }}
                      className="mr-2"
                    />
                  </HStack>
                  <HStack space="lg">
                    <VStack className="flex-1" space="md">
                      <Text size="xl">Messages</Text>
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
                      className="mr-2"
                    />
                  </HStack>
                </VStack>
                <VStack space="xl">
                  <Heading size="xl" className="text-left mt-5">
                    Privacy and Security
                  </Heading>
                  <VStack space="md">
                    <Text size="xl">Location</Text>
                    <Text size="md">
                      To find the distance between you and events. Your location
                      is only visible to you.
                    </Text>
                    <Box className="border border-primary-0 rounded-md justify-center items-center flex flex-row">
                      <Icon
                        size="xl"
                        as={MapPin}
                        className="color-primary-0 ml-2"
                      />
                      <GooglePlacesAutocomplete
                        listViewDisplayed={false}
                        placeholder="UNSW Sydney, Sydney NSW, Australia"
                        styles={{
                          textInputContainer: {
                            width: "100%",
                            fontSize: 12,
                          },
                        }}
                        onPress={(data, details = null) => {
                          setLocation({
                            description: data["description"],
                            id: data["place_id"],
                          });
                        }}
                        query={{
                          key: GOOGLE_MAPS_API_KEY,
                          language: "en",
                          components: "country:aus",
                        }}
                      />
                    </Box>
                  </VStack>
                  <HStack space="lg">
                    <VStack space="md" className="flex-1">
                      <Text size="xl">Private Account</Text>
                      <Text size="md">
                        A private account hides your bio and profile picture
                        from other users.
                      </Text>
                    </VStack>
                    <Switch
                      size="lg"
                      value={privateAccount}
                      onValueChange={setPrivateAccount}
                      trackColor={{ true: "#fb9d4b" }}
                      className="mr-2"
                    />
                  </HStack>
                </VStack>
                <VStack space="xl">
                  <Heading size="xl" className="text-left mt-5">
                    Accessibility
                  </Heading>
                  <HStack>
                    <VStack space="md" className="flex-1">
                      <Text size="xl">Dark Mode</Text>
                    </VStack>
                    <Switch
                      size="lg"
                      trackColor={{ true: "#fb9d4b" }}
                      className="mr-2"
                    />
                  </HStack>
                  <HStack space="lg">
                    <VStack space="md" className="flex-1">
                      <Text size="xl">Text Size</Text>
                    </VStack>
                    <Box className="flex-1 justify-center">
                      <Slider
                        defaultValue={50}
                        size="lg"
                        orientation="horizontal"
                        isDisabled={false}
                        isReversed={false}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </Box>
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
      </KeyboardAvoidingView>
    </Box>
  );
}
