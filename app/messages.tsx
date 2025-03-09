import React, { useState, useEffect } from "react";
import { User, UserChat, Chat } from "@/types";
import { ScrollView } from "react-native";

import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import ToggleSwitch from "./components/buttons/toggleSwitch";

import AsyncStorage from "@react-native-async-storage/async-storage";

import ChatCard from "./components/cards/chatCard";
import SearchBar from "./components/bars/searchBar";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";

import { getOtherMemberName, getPrivateChatCoverPhoto } from "@/helpers";

type ChatCard = {
  chats: Chat[];
  filterCondition?: (chat: Chat) => boolean | undefined;
  errorMsg: string;
};

export default function Messages() {
  const [loading, setLoading] = useState(true);
  const [isEventActive, setIsEventActive] = useState(true);
  const [isPrivateActive, setIsPrivateActive] = useState(false);
  const [allUserDetails, setAllUserDetails] = useState<User[]>([]);
  const [currUser, setCurrUser] = useState<User>();
  const [groupChatDetails, setGroupChatDetails] = useState<Chat[]>([]);
  const [privateChatDetails, setPrivateChatDetails] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadChats = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        const allUsersJsonData = await AsyncStorage.getItem("data");

        if (userID && allUsersJsonData) {
          const allUsers = JSON.parse(allUsersJsonData).Users;
          const allGroupChats = JSON.parse(allUsersJsonData).GroupChats;
          const allPrivateChats = JSON.parse(allUsersJsonData).PrivateChats;
          setAllUserDetails(allUsers);
          const currentUser = allUsers.find((user: User) => user.id === userID);
          setCurrUser(currentUser);

          const userEventChats = currentUser.chats
            .map((userChat: UserChat) =>
              allGroupChats.find(
                (chat: Chat) => chat.id === userChat.id && chat.groupChat,
              ),
            )
            .filter(
              (chat: Chat | undefined): chat is Chat => chat !== undefined,
            );

          const userPrivateChats = currentUser.chats
            .map((userChat: UserChat) =>
              allPrivateChats.find(
                (chat: Chat) => chat.id === userChat.id && !chat.groupChat,
              ),
            )
            .filter(
              (chat: Chat | undefined): chat is Chat => chat !== undefined,
            );

          setGroupChatDetails(userEventChats);
          setPrivateChatDetails(userPrivateChats);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load chats data:", error);
      }
    };

    loadChats();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const filteredGroupChats = groupChatDetails?.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPrivateChats = privateChatDetails?.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderChatCards = ({
    chats,
    filterCondition = (chat: Chat) => true,
    errorMsg,
  }: ChatCard) => {
    const filteredChats = chats?.filter(filterCondition);

    return (
      <>
        {chats && filteredChats.length > 0 ? (
          filteredChats.map((chat: Chat) => (
            <ChatCard
              key={chat.id}
              chatId={chat.id}
              name={
                chat.name === ""
                  ? getOtherMemberName(chat, currUser?.id!, allUserDetails)
                  : chat.name
              }
              coverPhoto={
                chat.coverPhoto === ""
                  ? getPrivateChatCoverPhoto(
                      chat,
                      currUser?.id!,
                      allUserDetails,
                    )
                  : chat.coverPhoto
              }
              lastAuthor={
                allUserDetails?.find(
                  (user: User) =>
                    user.id === chat.messages[chat.messages.length - 1]?.sender,
                )?.name
              }
              lastMessage={chat.messages[chat.messages.length - 1]?.message}
            />
          ))
        ) : (
          <>
            {!searchQuery && (
              <Box className="m-5">
                <Text size="xl" style={{ color: "#9c9c9c" }}>
                  {errorMsg}
                </Text>
              </Box>
            )}
          </>
        )}
      </>
    );
  };

  return loading ? (
    <Box className="h-full bg-white">
      <Spinner size="large" className="m-40" />
    </Box>
  ) : (
    <>
      <Box className="flex-1 justify-start bg-gray-50 p-5">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={handleSearch}
          placeholder="Search for chats..."
        />
        <ToggleSwitch
          isFirstActive={isEventActive}
          setIsFirstActive={setIsEventActive}
          isSecondActive={isPrivateActive}
          setIsSecondActive={setIsPrivateActive}
          firstToggleLabel="Event Chats"
          secondToggleLabel="Private Chats"
          className="mb-6 mt-4"
        />
        <ScrollView className="flex-1">
          {isEventActive && (
            <>
              {!searchQuery && (
                <Heading size="xl" className="pt-3">
                  Upcoming Events
                </Heading>
              )}
              <VStack space="md" className="text-lg mt-2">
                {renderChatCards({
                  chats: filteredGroupChats,
                  filterCondition: (chat) => !chat?.archived,
                  errorMsg: "You have not joined any upcoming event chats.",
                })}
              </VStack>
              <VStack>
                {!searchQuery && (
                  <Heading size="xl" className="pt-3">
                    Past Events
                  </Heading>
                )}
                <VStack space="md" className="text-lg mt-2">
                  {renderChatCards({
                    chats: filteredGroupChats,
                    filterCondition: (chat) => chat?.archived,
                    errorMsg: "You have not jonied any past event chats.",
                  })}
                </VStack>
              </VStack>
            </>
          )}
          {isPrivateActive && (
            <VStack space="md" className="text-lg mt-2">
              {renderChatCards({
                chats: filteredPrivateChats,
                errorMsg: "You have not created any private chats.",
              })}
            </VStack>
          )}
        </ScrollView>
      </Box>
    </>
  );
}
