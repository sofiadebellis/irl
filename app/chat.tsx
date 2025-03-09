import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { Platform } from "react-native";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import { User, Chat, Message } from "@/types";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { TextInput } from "react-native";
import { Box } from "@/components/ui/box";
import { Input } from "@/components/ui/input";
import { Fab, FabIcon } from "@/components/ui/fab";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MenuIcon,
  Icon,
} from "@/components/ui/icon";
import { Volume2 } from "lucide-react-native";
import { getOtherMemberName, getPrivateChatCoverPhoto } from "@/helpers";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";

export default function EventChat() {
  const [currUserId, setCurrUserId] = useState<string>("");
  const [currChat, setCurrChat] = useState<Chat>();
  const [inputText, setInputText] = useState("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [allUserData, setAllUserData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { chatId, chatName, coverPhoto } = useLocalSearchParams();

  useEffect(() => {
    const loadChat = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        const allUsersJsonData = await AsyncStorage.getItem("data");
        setAllUserData(
          allUsersJsonData ? JSON.parse(allUsersJsonData).Users : "",
        );
        setCurrUserId(userID ? userID : "");

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
  }, [chatId]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, chatIndex } = await getChatData();
        if (chatIndex !== -1) {
          const chatArray: Chat[] = currChat?.groupChat
            ? data.GroupChats
            : data.PrivateChats;
          setAllMessages(chatArray[chatIndex].messages);
        }
      } catch (error) {
        console.error("Error loading messages", error);
      }
    };
    loadMessages();
  });

  const getChatData = async () => {
    const allJsonData = await AsyncStorage.getItem("data");
    const data = allJsonData ? JSON.parse(allJsonData) : {};
    const chatArray: Chat[] = currChat?.groupChat
      ? data.GroupChats
      : data.PrivateChats;
    const chatIndex = chatArray.findIndex((chat: Chat) => chat.id === chatId);
    return { data, chatArray, chatIndex };
  };

  const setMessage = async (newMessage: Message) => {
    try {
      const { data, chatArray, chatIndex } = await getChatData();
      if (chatIndex !== -1) {
        chatArray[chatIndex].messages.push(newMessage);
        setAllMessages(chatArray[chatIndex].messages);
        currChat?.groupChat
          ? (data.GroupChats = chatArray)
          : (data.PrivateChats = chatArray);
        await AsyncStorage.setItem("data", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error setting message", error);
    }
  };

  const handleMessage = () => {
    const newMessage = {
      sender: currUserId,
      timestamp: new Date().toISOString(),
      message: inputText,
    };
    setMessage(newMessage);
    setInputText("");
  };

  const latestMessageIndex: { [key: string]: number } = allMessages.reduce(
    (acc: { [key: string]: number }, message, index) => {
      acc[message.sender] = index;
      return acc;
    },
    {},
  );

  const renderUserProfilePic = (sender: string, index: number) => {
    if (latestMessageIndex[sender] === index) {
      return (
        <Pressable
          className="absolute bottom-5"
          onPress={() => router.push(`/view-user?id=${sender}`)}
        >
          <Image
            source={{
              uri: `${
                allUserData.find((user: User) => user.id === sender).image
              }`,
            }}
            className="w-[25px] h-[25px] rounded-full"
          />
        </Pressable>
      );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Box style={{ backgroundColor: "#FFFFFF" }} className="h-full">
      {loading ? (
        <Box className="m-40">
          <Spinner size="large" />
        </Box>
      ) : (
        <>
          <Box className="p-5 bg-slate-200 absolute bottom-44 right-5 z-10 rounded-full">
            <Icon
              as={Volume2}
              width={50}
              height={50}
              color="black"
            />
          </Box>
          <Fab
            placement="top left"
            size="lg"
            onPress={() => router.back()}
            className="border border-black bg-white p-2 mt-1 active:bg-white focus:bg-white"
            style={{
              position: "absolute",
              zIndex: 1,
              backgroundColor: "white",
              height: 45,
              width: 45,
            }}
          >
            <FabIcon
              as={ArrowLeftIcon}
              className="text-black"
              onPress={() => router.back()}
            />
          </Fab>
          <Box className="w-full h-[90px] border-b-[#E1E1DF] border-b-2 flex flex-row items-center justify-center">
            <Box
              className="w-[60%] h-full flex flex-row items-center gap-2"
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  resizeMode: "cover",
                }}
                source={{
                  uri: `${
                    coverPhoto
                      ? coverPhoto
                      : getPrivateChatCoverPhoto(
                          currChat!,
                          currUserId,
                          allUserData,
                        )
                  }`,
                }}
                alt="Event cover img"
              />
              <Text
                className="max-w-inherit text-xl font-semibold"
                style={{ flexShrink: 1 }}
              >
                {chatName
                  ? chatName
                  : getOtherMemberName(currChat!, currUserId, allUserData)}
              </Text>
            </Box>
          </Box>
          <Pressable
            className="flex-end justify-start items-end absolute top-8 right-6"
            onPress={() =>
              router.push(
                `/chat-info?chatId=${currChat?.id}&chatName=${chatName}`,
              )
            }
          >
            <MenuIcon
              className="text-black"
              width={35}
              height={35}
              color="black"
            />
          </Pressable>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 48 : 0}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Box className="flex px-2">
                {allMessages.map((message, index) => (
                  <Box
                    key={index}
                    className={`flex flex-row items-end ${
                      message.sender === currUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender !== currUserId &&
                      renderUserProfilePic(message.sender, index)}
                    <Box>
                      <Box className="flex">
                        <Box
                          className={`p-2 mt-2 max-w-[200px] ${
                            message.sender === currUserId
                              ? "bg-[#FDB474] rounded-md mr-[35px]"
                              : "bg-[#F4F5F7] rounded-md ml-[35px]"
                          }`}
                        >
                          <Text>{message.message}</Text>
                        </Box>
                        <Text
                          className={`${
                            message.sender === currUserId
                              ? "self-end pr-10"
                              : "self-start pl-10"
                          }`}
                        >
                          {formatTimestamp(message.timestamp)}
                        </Text>
                      </Box>
                      <Text
                        className={`${
                          message.sender === currUserId
                            ? "self-end pr-10"
                            : "self-start pl-10"
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                      </Text>
                    </Box>
                    {message.sender === currUserId &&
                      renderUserProfilePic(message.sender, index)}
                  </Box>
                ))}
              </Box>
              <Box className="w-full border-t-2 border-[#DDDCDB] pt-6 absolute bottom-20 flex flex-row gap-3">
                <Input
                  variant="rounded"
                  size="xl"
                  className="pl-1 ml-3 bg-white border border-[#F0F0F0] w-[82%] self-start"
                  style={{ backgroundColor: "#F4F5F7", borderRadius: 2 }}
                >
                  <TextInput
                    multiline
                    numberOfLines={3}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type new message..."
                    style={{
                      padding: 10,
                      backgroundColor: "#F4F5F7",
                      borderColor: "#F0F0F0",
                      borderWidth: 1,
                      borderRadius: 2,
                      width: "100%",
                    }}
                  />
                </Input>
                <Pressable
                  className="flex justify-center items-center bg-orange-400 rounded-full p-2"
                  onPress={inputText === "" ? () => {} : handleMessage}
                >
                  <ArrowRightIcon
                    width={30}
                    height={30}
                    className="bg-white"
                    color="white"
                    fill="none"
                    stroke="white"
                  />
                </Pressable>
              </Box>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
    </Box>
  );
}
