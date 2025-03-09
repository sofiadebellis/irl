import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { CalendarCog, LogOut, UserPen, Users } from "lucide-react-native";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { CloseIcon, Icon } from "@/components/ui/icon";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [university, setUniversity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        if (userID) {
          const jsonData = await AsyncStorage.getItem("data");
          const data = jsonData ? JSON.parse(jsonData) : { Users: [] };
          const user = data.Users.find((user: any) => user.id === userID);

          if (user) {
            setName(user.name || "Unknown User");
            setPronouns(user.pronouns || "Pronouns not specified");
            setBio(user.bio || "No bio");
            setUniversity(user.university || "University not specified");
            setImage(user.image);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userID");
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return loading ? (
    <Box className="h-full bg-white">
      <Spinner size="large" className="m-40" />
    </Box>
  ) : (
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: "#FFFFFF" }}
        className={`relative ${isModalOpen ? "blur-sm" : ""} h-full`}
      >
        <Center className="flex-1 bg-white p-10">
          <VStack space="4xl" className="w-full">
            <Avatar size="2xl" className="flex items-center justify-center">
              <AvatarFallbackText>{name}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri:
                    image ||
                    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
                }}
              />
            </Avatar>
            <VStack space="lg" className="w-full">
              <VStack>
                <Heading text-typography-950 size="4xl">
                  {name}
                </Heading>
                <Text text-typography-950 size="lg">
                  {pronouns} | {university}
                </Text>
              </VStack>
              <Text
                style={{ color: "black" }}
                size="2xl"
                className="text-medium"
              >
                {bio}
              </Text>
            </VStack>
            <VStack space="2xl" className="w-full mt-5">
              <Button size="xl" onPress={() => router.push("/view-friends")}>
                <ButtonIcon as={Users} size="md" />
                <ButtonText>View All Friends</ButtonText>
              </Button>
              <Button size="xl" onPress={() => router.push("/edit-profile")}>
                <ButtonIcon as={UserPen} size="md" />

                <ButtonText>Edit Profile</ButtonText>
              </Button>
              <Button size="xl">
                <ButtonIcon as={CalendarCog} size="md" />
                <ButtonText>Update Availability</ButtonText>
              </Button>
              <Button size="xl" onPress={() => router.push("/settings")}>
                <ButtonIcon as={Users} size="md" />
                <ButtonText>Account Settings</ButtonText>
              </Button>
              <Button
                size="xl"
                variant="outline"
                onPress={() => setIsModalOpen(true)}
              >
                <ButtonIcon as={LogOut} size="md" />
                <ButtonText>Log out</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Center>
      </ScrollView>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="2xl">Log out confirmation</Heading>
            <ModalCloseButton onPress={() => setIsModalOpen(false)}>
              <Icon
                as={CloseIcon}
                size="xl"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text size="xl">Are you sure you want to log out?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              size="xl"
              onPress={() => {
                setIsModalOpen(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setIsModalOpen(false);
                handleLogout();
              }}
              size="xl"
              className="bg-tertiary-400"
            >
              <ButtonText>Log out</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
