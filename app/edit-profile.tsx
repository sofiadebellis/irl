import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { HStack } from "@/components/ui/hstack";
import { router } from "expo-router";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { ArrowLeftIcon, ChevronDownIcon } from "@/components/ui/icon";
import { Fab, FabIcon } from "@/components/ui/fab";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [pronouns, setPronouns] = useState<string>("");
  const [universityValue, setUniversityValue] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        if (userID) {
          const jsonData = await AsyncStorage.getItem("data");
          const data = jsonData ? JSON.parse(jsonData) : { Users: [] };
          const user = data.Users.find((user: any) => user.id === userID);

          if (user) {
            setName(user.name || "");
            setPronouns(user.pronouns || "");
            setUniversityValue(user.university || "");
            setBio(user.bio || "");
            setImage(user.image || null);
          }
          setLoading(false);
        } else {
          console.error("No userID found in Async Storage.");
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    loadProfileData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveProfileData = async () => {
    try {
      const userID = await AsyncStorage.getItem("userID");
      const jsonData = await AsyncStorage.getItem("data");
      const data = jsonData ? JSON.parse(jsonData) : { Users: [] };

      const updatedUsers = data.Users.map((user: any) =>
        user.id === userID
          ? {
              ...user,
              name,
              pronouns,
              university: universityValue,
              bio,
              image,
            }
          : user
      );

      const updatedData = { ...data, Users: updatedUsers };
      await AsyncStorage.setItem("data", JSON.stringify(updatedData));

      router.push("/profile");
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  return loading ? (
    <Box className="h-full bg-white">
      <Spinner size="large" className="m-40" />
    </Box>
  ) : (
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
            size="xl"
          />
        </Fab>
        <Center className="flex-1 bg-white mt-10">
          <Box className="w-full">
            <VStack space="lg" className="ml-10 mr-10">
              <Heading size="3xl" className="text-left ml-10 mt-2">
                Edit Profile
              </Heading>

              <HStack
                space="3xl"
                className="w-full items-center justify-between pr-5 pl-5"
              >
                <TouchableOpacity onPress={pickImage}>
                  <Avatar size="2xl">
                    <AvatarImage
                      source={{
                        uri:
                          image ||
                          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
                      }}
                    />
                  </Avatar>
                </TouchableOpacity>

                <Button
                  variant="outline"
                  size="lg"
                  onPress={pickImage}
                  className="mr-5"
                >
                  <ButtonText>Edit Picture</ButtonText>
                </Button>
              </HStack>

              <VStack className="w-full mt-4" space="lg">
                <VStack space="xs">
                  <Text size="xl">Name</Text>
                  <Input variant="outline" size="xl" isRequired={true}>
                    <InputField value={name} onChangeText={setName} />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text size="xl">Pronouns</Text>
                  <Input variant="outline" size="xl" isRequired={true}>
                    <InputField value={pronouns} onChangeText={setPronouns} />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text size="xl">University</Text>
                  <Select
                    selectedValue={universityValue}
                    onValueChange={setUniversityValue}
                  >
                    <SelectTrigger variant="outline" size="xl">
                      <HStack className="w-full items-center justify-between pr-2">
                        <SelectInput className="flex-1" />
                        <SelectIcon as={ChevronDownIcon} />
                      </HStack>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectItem
                          label="University of New South Wales"
                          value="University of New South Wales"
                        />
                        <SelectItem
                          label="University of Sydney"
                          value="University of Sydney"
                        />
                        <SelectItem
                          label="University of Technology Sydney"
                          value="University of Technology Sydney"
                        />
                        <SelectItem
                          label="Macquarie University"
                          value="Macquarie University"
                        />
                        <SelectItem label="Other" value="Other" />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </VStack>

                <VStack space="xs">
                  <Text size="xl">Bio</Text>
                  <Textarea size="xl">
                    <TextareaInput
                      value={bio}
                      onChangeText={setBio}
                      numberOfLines={3}
                      multiline={true}
                    />
                  </Textarea>
                </VStack>
              </VStack>

              <Button
                variant="solid"
                size="xl"
                className="mt-5"
                onPress={saveProfileData}
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
