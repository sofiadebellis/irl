import React, { useState, useEffect } from "react";
import { Image, ScrollView } from "react-native";
import { Chat } from "@/types";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ArrowLeftIcon } from "@/components/ui/icon";
import GroupInfo from "./components/GroupInfo";
import PrivInfo from "./components/PrivInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";

export default function ChatInfo() {
  const [currChat, setCurrChat] = useState<Chat>();
  const [loading, setLoading] = useState<boolean>(true);
  const { chatId, chatName } = useLocalSearchParams();

  useEffect(() => {
    const loadChat = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        const allUsersJsonData = await AsyncStorage.getItem("data");
        if (userID && allUsersJsonData) {
          const allGroupChats = JSON.parse(allUsersJsonData).GroupChats;
          const allPrivateChats = JSON.parse(allUsersJsonData).PrivateChats;

          const allChats = [...allGroupChats, ...allPrivateChats];
          const chat = allChats.find((chat: Chat) => chat.id === chatId);
          setCurrChat(chat);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    loadChat();
  });

  return (
    <Box style={{ backgroundColor: "#FFFFFF" }} className="h-full px-3">
      {loading ? (
        <Box className="m-40">
          <Spinner size="large" />
        </Box>
      ) : (
        <>
          <Fab
            placement="top left"
            size="lg"
            onPress={() => router.back()}
            className="border border-black bg-white p-2 mt-1 active:bg-white focus:bg-white"
            style={{
              position: "absolute",
              top: 25,
              zIndex: 1,
              backgroundColor: "black",
              height: 45,
              width: 45,
            }}
          >
            <FabIcon
              as={ArrowLeftIcon}
              className="text-white"
              onPress={() => router.back()}
            />
          </Fab>
          <ScrollView>
            <Box className="flex items-center justify-center">
              <Image
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: 150,
                  resizeMode: "cover",
                  marginTop: 30,
                }}
                source={{
                  uri: currChat?.coverPhoto,
                }}
                alt="Chat cover img"
              />
              <Text className="font-bold text-4xl mt-6 text-black text-center">
                {chatName}
              </Text>
            </Box>
            {currChat?.groupChat && <GroupInfo />}
            {!currChat?.groupChat && <PrivInfo />}
          </ScrollView>
        </>
      )}
    </Box>
  );
}
