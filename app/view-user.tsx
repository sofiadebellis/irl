import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ArrowLeftIcon, SlashIcon } from "@/components/ui/icon";
import { useRouter, useLocalSearchParams } from "expo-router";
import { User } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Share, TriangleAlert, UserMinus, UserPlus } from "lucide-react-native";

export default function ViewUser() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currUserId, setCurrUserId] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const jsonData = await AsyncStorage.getItem("data");
        const userId = await AsyncStorage.getItem("userID");
        setCurrUserId(userId ? userId : "");

        const data = jsonData
          ? JSON.parse(jsonData)
          : { Events: [], Users: [] };

        const foundUser = data.Users.find((user: User) => user.id === id);
        if (foundUser) {
          setUser(foundUser);

          const loggedInUser = data.Users.find(
            (user: User) => user.id === userId,
          );
          if (loggedInUser) {
            setIsFriend(loggedInUser.friends.map(String).includes(String(id)));
          } else {
            setIsFriend(false);
          }
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [id]);

  const addFriend = async () => {
    try {
      const jsonData = await AsyncStorage.getItem("data");
      const userId = await AsyncStorage.getItem("userID");

      if (jsonData && userId) {
        const data = JSON.parse(jsonData);
        const loggedInUser = data.Users.find(
          (user: User) => user.id === userId,
        );

        if (loggedInUser) {
          loggedInUser.friends.push(id);
          await AsyncStorage.setItem("data", JSON.stringify(data));
          setIsFriend(true);
        }
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const removeFriend = async () => {
    try {
      const jsonData = await AsyncStorage.getItem("data");
      const userId = await AsyncStorage.getItem("userID");

      if (jsonData && userId) {
        const data = JSON.parse(jsonData);
        const loggedInUser = data.Users.find(
          (user: User) => user.id === userId,
        );

        if (loggedInUser) {
          loggedInUser.friends = loggedInUser.friends.filter(
            (friendId: string) => friendId !== id,
          );

          await AsyncStorage.setItem("data", JSON.stringify(data));
          setIsFriend(false);
        }
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  if (!user) {
    return (
      <Box className="h-full bg-white">
        <Spinner size="large" className="m-40" />
      </Box>
    );
  }

  return (
    <Box style={{ backgroundColor: "#FFFFFF" }} className="h-full">
      <ScrollView className="flex-1 relative">
        <Fab
          placement="top left"
          size="lg"
          onPress={() => router.back()}
          className="border border-black bg-white p-2 active:bg-white focus:bg-white"
          style={{ position: "absolute", zIndex: 1, height: 50, width: 50 }}
        >
          <FabIcon
            as={ArrowLeftIcon}
            onPress={() => router.back()}
            className="text-black"
            size="xl"
          />
        </Fab>

        <Center className="bg-white mt-10">
          <Box className="w-full h-full">
            <VStack space="4xl" className="mt-4 pt-10 ml-10 mr-10">
              <VStack space="2xl">
                <Avatar size="2xl" className="flex items-center justify-center">
                  <AvatarImage
                    source={{
                      uri:
                        user?.image ||
                        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
                    }}
                  />
                </Avatar>
                <VStack>
                  <Heading text-typography-950 size="4xl">
                    {user?.name}
                  </Heading>
                  <Text text-typography-950 size="xl">
                    {user?.pronouns} | {user?.university}
                  </Text>
                </VStack>
                <Text
                  style={{ color: "black" }}
                  size="2xl"
                  className="text-medium"
                >
                  {user?.bio}
                </Text>
                {id !== currUserId &&
                  (isFriend ? (
                    <Button size="xl" onPress={removeFriend}>
                      <ButtonIcon as={UserMinus} />
                      <ButtonText>Remove friend</ButtonText>
                    </Button>
                  ) : (
                    <Button size="xl" onPress={addFriend}>
                      <ButtonIcon as={UserPlus} />
                      <ButtonText>Add friend</ButtonText>
                    </Button>
                  ))}
              </VStack>
              {id !== currUserId && (
                <VStack space="xl">
                  <Heading size="xl">Privacy and Support</Heading>
                  <VStack space="sm">
                    <Button size="xl" variant="outline">
                      <ButtonIcon className="text-black" as={SlashIcon} />
                      <ButtonText className="text-black">Block</ButtonText>
                    </Button>
                    <Button size="xl" variant="outline">
                      <ButtonIcon className="text-black" as={TriangleAlert} />
                      <ButtonText className="text-black">Report</ButtonText>
                    </Button>
                    <Button size="xl" variant="outline">
                      <ButtonIcon className="text-black" as={Share} />
                      <ButtonText className="text-black">Share</ButtonText>
                    </Button>
                  </VStack>
                </VStack>
              )}
            </VStack>
          </Box>
        </Center>
      </ScrollView>
    </Box>
  );
}
