import React, { useState, useEffect } from "react";
import { Image, ScrollView } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import { User, Chat } from "@/types";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Users } from "lucide-react-native";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ArrowLeftIcon } from "@/components/ui/icon";
import ToggleSwitch from "./components/buttons/toggleSwitch";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";
import { P } from "@expo/html-elements";

export default function ViewMembers() {
  const [currChat, setCurrChat] = useState<Chat>();
  const [allUserData, setAllUserData] = useState<any>({});
  const [chatMembers, setChatMembers] = useState<User[]>([]);
  const [admin, setAdmin] = useState<User>();
  const [showMembers, setShowMembers] = useState<boolean>(true);
  const [showAdmins, setShowAdmins] = useState<boolean>(false);

  const { chatId } = useLocalSearchParams();

  useEffect(() => {
    const getChatMembers = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        const allUsersJsonData = await AsyncStorage.getItem("data");
        setAllUserData(allUsersJsonData ? JSON.parse(allUsersJsonData) : "");

        if (userID && allUsersJsonData) {
          const allGroupChats = JSON.parse(allUsersJsonData).GroupChats;
          const chat = allGroupChats.find((chat: Chat) => chat.id === chatId);
          setCurrChat(chat);
          if (chat) {
            const members = chat.members
              .map((member: string) => {
                return JSON.parse(allUsersJsonData).Users.find(
                  (user: User) => user.id === member
                );
              })
              .filter(
                (user: User | undefined): user is User => user !== undefined
              );

            setChatMembers(members);

            const adminId = chat.admins?.[0];
            const admin = JSON.parse(allUsersJsonData).Users.find(
              (user: User) => user.id === adminId
            );
            setAdmin(admin);
          }
        }
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    getChatMembers();
  }, []);

  const renderChatMembers = (member: User, idx: number) => {
    return (
      <Pressable
        key={idx}
        className="flex flex-row justify-between items-center p-3 w-[85%] self-center"
        onPress={() => router.push(`/view-user?id=${member.id}`)}
      >
        <Box className="flex flex-row items-center gap-3">
          <Image
            source={{ uri: member.image }}
            style={{
              width: 45,
              height: 45,
              borderRadius: 150,
              resizeMode: "cover",
            }}
            alt="Member profile pictures"
          />
          <Box>
            <Text className="text-xl font-semibold text-black">
              {member.name}
            </Text>
            {member.name !== admin?.name ? (
              <Text className="text-md">
                Added by {admin?.name ?? "Unknown"}
              </Text>
            ) : (
              <Text className="text-md">Group Creator</Text>
            )}
          </Box>
        </Box>
      </Pressable>
    );
  };

  return (
    <Box style={{ backgroundColor: "#FFFFFF" }} className="h-full">
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
      <Text className="font-bold text-5xl mt-10 text-black text-center mb-6">
        Members
      </Text>

      <Box className="flex flex-row gap-3 items-center justify-center mb-3">
        <ToggleSwitch
          isFirstActive={showMembers}
          setIsFirstActive={setShowMembers}
          isSecondActive={showAdmins}
          setIsSecondActive={setShowAdmins}
          firstToggleLabel="Members"
          secondToggleLabel="Admins"
          className="w-[85%]"
        />
        {/* <Pressable
          className={`rounded-3xl w-[40%] p-3 flex items-center justify-center ${
            showMembers ? "bg-black" : "bg-white border-2 border-black"
          }`}
          onPress={() => {
            setShowMembers(!showMembers);
            setShowAdmins(false);
          }}
        >
          <Text className={`${showMembers ? "text-white" : "text-black"}`}>
            All Members
          </Text>
        </Pressable>
        <Pressable
          className={`bg-black rounded-3xl w-[40%] p-3 flex items-center justify-center ${
            showAdmins ? "bg-black" : "bg-white border-2 border-black"
          }`}
          onPress={() => {
            setShowAdmins(!showAdmins);
            setShowMembers(false);
          }}
        >
          <Text
            className={`${
              showAdmins ? "text-white " : "text-black"
            }`}
          >
            Admins
          </Text>
        </Pressable> */}
      </Box>

      {showMembers &&
        chatMembers.map((member: User, idx: number) =>
          renderChatMembers(member, idx)
        )}
      {showAdmins &&
        chatMembers.map((member: User, idx: number) => {
          return currChat?.admins?.includes(member.id)
            ? renderChatMembers(member, idx)
            : null;
        })}
    </Box>
  );
}
