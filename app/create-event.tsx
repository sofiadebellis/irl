import React, { useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Fab, FabIcon } from "@/components/ui/fab";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  ArrowLeftIcon,
  ChevronDownIcon,
  Icon,
  RepeatIcon,
} from "@/components/ui/icon";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import {
  EventCategory,
  EventPrice,
  EventType,
  Status,
  User,
  UserEvent,
} from "@/types";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { HStack } from "@/components/ui/hstack";
import { MapPin, Upload } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { priceLabelMap, priceTextMap } from "@/helpers";

export default function CreateEvent() {
  const [name, setName] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EventCategory>();
  const [price, setPrice] = useState<EventPrice>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const validate = () => {
    if (!name) {
      alert("Event name is required.");
      return false;
    }
    if (!coverPhoto) {
      alert("Cover photo is required.");
      return false;
    }
    if (endDate < startDate) {
      alert("End time cannot be before start time.");
      return false;
    }
    if (startDate < new Date()) {
      alert("Start time cannot be in the past.");
      return false;
    }
    if (!category) {
      alert("Category is required.");
      return false;
    }
    if (!location) {
      alert("Location is required.");
      return false;
    }
    if (!price) {
      alert("Price is required.");
      return false;
    }
    if (!description) {
      alert("Event description is required.");
      return false;
    }
    return true;
  };

  const handleCreateEvent = async () => {
    if (!validate()) {
      return;
    }

    try {
      const jsonData = await AsyncStorage.getItem("data");
      const data = jsonData ? JSON.parse(jsonData) : { Events: [] };
      const id = uuidv4();

      const newEvent = {
        id,
        name,
        coverPhoto,
        location,
        description,
        category,
        price,
        start: startDate,
        end: endDate,
        host: await AsyncStorage.getItem("userID"),
        groupChat: id,
      };

      const updatedData = {
        ...data,
        Events: [...data.Events, newEvent],
      };

      const userId = await AsyncStorage.getItem("userID");
      const userIndex = updatedData.Users.findIndex(
        (user: User) => user.id === userId,
      );

      if (userIndex !== -1) {
        const userEvent: UserEvent = {
          id,
          status: Status.GOING,
          type: EventType.CREATED,
        };

        updatedData.Users[userIndex].events.push(userEvent);
        updatedData.Users[userIndex].chats.push({
          id,
          name: name,
          groupChat: true,
          archived: false,
        });
      } else {
        console.error("User not found");
      }

      const newChat = {
        id,
        name,
        coverPhoto,
        members: [userId],
        admins: [userId],
        messages: [],
        groupChat: true,
        archived: false,
      };

      updatedData.GroupChats = [...updatedData.GroupChats, newChat];
      await AsyncStorage.setItem("data", JSON.stringify(updatedData));
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setCoverPhoto(result.assets[0].uri);
    }
  };

  const handleTimeChange = (selectedDate?: Date, isStart = true) => {
    if (selectedDate) {
      isStart ? setStartDate(selectedDate) : setEndDate(selectedDate);
    }
  };

  return (
    <Box style={{ backgroundColor: "#FFFFFF" }} className="h-full">
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
            className="text-black"
          />
        </Fab>

        <Center className="flex-1 bg-white mt-10">
          <Box className="w-full bg-white">
            <VStack space="lg" className="ml-10 mr-10">
              <Heading size="3xl" className="text-left ml-10 mt-2">
                Create Event
              </Heading>
              <VStack space="sm" className="mt-4">
                <Text size="2xl">Event Name</Text>
                <Input size="xl">
                  <InputField
                    placeholder="Please enter your event name"
                    value={name}
                    onChangeText={setName}
                  />
                </Input>
              </VStack>
              <VStack space="sm" className="mt-4">
                <Text size="2xl">Cover photo</Text>
                <Button variant="outline" size="xl" onPress={pickImage}>
                  {coverPhoto === "" ? (
                    <>
                      <ButtonIcon as={Upload} />
                      <ButtonText>Upload cover photo</ButtonText>
                    </>
                  ) : (
                    <>
                      <ButtonIcon as={RepeatIcon} />
                      <ButtonText>Change cover photo</ButtonText>
                    </>
                  )}
                </Button>
              </VStack>
              <HStack space="md" className="mt-4 w-full">
                <VStack space="sm" className="flex-1">
                  <Text size="2xl">Start Date</Text>
                  <DateTimePicker
                    value={startDate}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) =>
                      handleTimeChange(selectedDate, true)
                    }
                  />
                </VStack>
                <VStack space="sm" className="flex-1">
                  <Text size="2xl">End Date</Text>
                  <DateTimePicker
                    value={endDate}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) =>
                      handleTimeChange(selectedDate, false)
                    }
                  />
                </VStack>
              </HStack>
              <VStack space="md" className="mt-4">
                <Text size="2xl">Category</Text>

                <Select
                  selectedValue={category}
                  onValueChange={(value) => setCategory(value as EventCategory)}
                >
                  <SelectTrigger
                    variant="outline"
                    size="xl"
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <SelectInput placeholder="Pick a category" />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      {Object.values(EventCategory).map((cat) => (
                        <SelectItem
                          label={cat}
                          value={cat}
                          key={cat}
                          style={{ paddingVertical: 10 }}
                        />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </VStack>
              <VStack space="sm" className="mt-4">
                <Text size="2xl">Location</Text>
                <Input size="xl">
                  <InputField
                    placeholder="Please enter your event location"
                    value={location}
                    onChangeText={setLocation}
                  />
                  <InputSlot className="mr-3">
                    <Icon as={MapPin} />
                  </InputSlot>
                </Input>
              </VStack>
              <VStack space="md" className="mt-4">
                <Text size="2xl">Price</Text>
                <HStack space="md" className="justify-between">
                  {Object.entries(priceLabelMap).map(([priceKey, label]) => (
                    <VStack key={priceKey} className="items-center flex-1">
                      <Button
                        variant={price === priceKey ? "solid" : "outline"}
                        onPress={() => setPrice(priceKey as EventPrice)}
                        size="lg"
                        className={"w-full"}
                      >
                        <ButtonText>
                          {priceTextMap[priceKey as EventPrice]}
                        </ButtonText>
                      </Button>
                      {label == "Free" ? (
                        <></>
                      ) : (
                        <Text size="md" className="mt-1">
                          {label}
                        </Text>
                      )}
                    </VStack>
                  ))}
                </HStack>
              </VStack>
              <VStack space="md" className="mt-4">
                <Text size="2xl">Event Description</Text>
                <Input size="xl" style={{ height: 80 }}>
                  <InputField
                    placeholder="Please enter your event description"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    style={{ textAlignVertical: "top" }}
                  />
                </Input>
              </VStack>
              <Button
                onPress={handleCreateEvent}
                size="xl"
                className="bg-tertiary-400"
                style={{ marginBottom: 50, marginTop: 20 }}
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
