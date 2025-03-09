import React, { useState, useEffect } from "react";
import { Pressable } from "@/components/ui/pressable";
import { Chat } from "@/types";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import ChatInfoStack from "./stacks/chatInfoStack";

import { CircleUser } from "lucide-react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

export default function PrivInfo() {
  const [currUserId, setCurrUserId] = useState<string>("");
  const [currChat, setCurrChat] = useState<Chat>();
  const { chatId } = useLocalSearchParams();

  useEffect(() => {
    const loadChat = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        const allUsersJsonData = await AsyncStorage.getItem("data");
        setCurrUserId(userID ? userID : "");

        if (userID && allUsersJsonData) {
          const allPrivateChats = JSON.parse(allUsersJsonData).PrivateChats;
          const chat = allPrivateChats.find((chat: Chat) => chat.id === chatId);
          setCurrChat(chat);
        }
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    loadChat();
  });

  return (
    <Box style={{ backgroundColor: "#FFFFFF" }} className="h-full mx-3">
      <Box className="flex flex-row justify-center gap-3 mt-4 mb-6">
        <Pressable
          className="flex flex-row gap-2 justify-center items-center bg-black w-[50%] p-3 rounded-md"
          onPress={() =>
            router.push(
              `/view-user?id=${currChat?.members.find(
                (member: string) => member !== currUserId
              )}`
            )
          }
        >
          <CircleUser width={16} height={16} color="white" />
          <Text className="text-white font-medium">View Profile Info</Text>
        </Pressable>
      </Box>
        <ChatInfoStack />
    </Box>
  );
}
