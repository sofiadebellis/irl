import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Pressable } from "@/components/ui/pressable";
import { User, Chat, Message } from "@/types";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { CalendarCheck, MessageSquare, Users } from "lucide-react-native";
import { ChevronRightIcon } from "@/components/ui/icon";
import ChatInfoStack from "./stacks/chatInfoStack";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";
import { getHostChatData } from "@/helpers";

type ChatButton = {
  buttonLabel: string;
};

export default function GroupInfo() {
  const [currUserId, setCurrUserId] = useState<string>("");
  const [currChat, setCurrChat] = useState<Chat>();
  const [allUserData, setAllUserData] = useState<any>({});
  const { chatId } = useLocalSearchParams();

  useEffect(() => {
    const loadChat = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        const allUsersJsonData = await AsyncStorage.getItem("data");
        setAllUserData(allUsersJsonData ? JSON.parse(allUsersJsonData) : "");
        setCurrUserId(userID ? userID : "");

        if (userID && allUsersJsonData) {
          const allGroupChats = JSON.parse(allUsersJsonData).GroupChats;
          const chat = allGroupChats.find((chat: Chat) => chat.id === chatId);
          setCurrChat(chat);
        }
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    loadChat();
  });

  const handlePress = async (buttonLabel: string) => {
    if (buttonLabel === "View Event Info") {
      router.push(`/view-event?id=${chatId}`);
    } else {
      const url = await getHostChatData(allUserData, currChat?.admins?.[0], currUserId);
      if (url) {
        router.push(url);
      }
    }
  };

  const renderButton = ({ buttonLabel }: ChatButton) => {
    return (
      <Pressable
        className="flex flex-row gap-2 justify-center items-center bg-black w-[45%] p-3 rounded-md"
        onPress={() => handlePress(buttonLabel)}
      >
        {buttonLabel === "View Event Info" ? (
          <CalendarCheck width={16} height={16} color="white" />
        ) : (
          <MessageSquare width={16} height={16} color="white" />
        )}
        <Text className="text-white font-medium">{buttonLabel}</Text>
      </Pressable>
    );
  };

  return (
    <Box style={{ backgroundColor: "#FFFFFF" }} className="h-full">
      <Box className="flex flex-row justify-center gap-3 mt-4">
        {renderButton({ buttonLabel: "View Event Info" })}
        {renderButton({ buttonLabel: "Message Host" })}
      </Box>
      <Box className="mt-4 mx-3 flex flex-col gap-4">
        <Box>
          <Text className="text-xl font-medium mb-2">Chat Info</Text>
          <Pressable
            className="flex flex-row items-center justify-between bg-[#F2F2F1] p-4 rounded-md"
            onPress={() => router.push(`/view-members?chatId=${chatId}`)}
          >
            <Box className="flex-row gap-2">
              <Users color="#525252" />
              <Text className="text-lg font-medium">See group members</Text>
            </Box>
            <ChevronRightIcon
              color="#525252"
              width={25}
              height={25}
              fill="none"
            />
          </Pressable>
        </Box>
        <ChatInfoStack />
      </Box>
    </Box>
  );
}
