import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendCard from "./components/cards/friendCard";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { User } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import SearchBar from "./components/bars/searchBar";

interface FriendCardProps {
  id: string;
  username: string;
  image: string;
  mutualFriends: number;
}

export default function ViewFriends() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<FriendCardProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredFriends, setFilteredFriends] = useState<FriendCardProps[]>([]);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        const allUsersJsonData = await AsyncStorage.getItem("data");

        if (userID && allUsersJsonData) {
          const allUsers = JSON.parse(allUsersJsonData).Users;
          const currentUser = allUsers.find((user: any) => user.id === userID);
          ``;

          if (currentUser) {
            const friendDetails = currentUser.friends
              .map((friendId: string) =>
                allUsers.find((user: User) => user.id === friendId),
              )
              .filter(Boolean)
              .map((friend: any) => ({
                id: friend.id,
                username: friend.name,
                image: friend.image,
                mutualFriends: calculateMutualFriends(currentUser, friend),
              }));

            setFriends(friendDetails);
          } else {
            console.warn("Current user not found in the Users data.");
          }
          setLoading(false);
        } else {
          console.warn(
            "User data or all users data is missing from Async Storage.",
          );
        }
      } catch (error) {
        console.error("Failed to load friends data:", error);
      }
    };

    loadFriends();
  }, []);

  useEffect(() => {
    setFilteredFriends(
      friends.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [searchQuery, friends]);

  const calculateMutualFriends = (currentUser: any, friend: any): number => {
    return currentUser.friends.filter((id: string) =>
      friend.friends.includes(id),
    ).length;
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
          <Box className="w-full bg-white">
            <VStack space="lg" className="ml-10 mr-10">
              <Heading size="3xl" className="text-left ml-10 mt-2">
                View Friends
              </Heading>

              <Box className="mt-5">
                <SearchBar
                  placeholder="Search for friends..."
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </Box>

              <VStack space="md">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend, index) => (
                    <TouchableOpacity
                      onPress={() => router.push(`/view-user?id=${friend.id}`)}
                      key={index}
                    >
                      <FriendCard
                        id={friend.id}
                        username={friend.username}
                        image={friend.image}
                        mutualFriends={friend.mutualFriends}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Box className="m-5">
                    <Text size="xl" style={{ color: "#9c9c9c" }}>
                      You have not added any friends.
                    </Text>
                  </Box>
                )}
              </VStack>
            </VStack>
          </Box>
        </Center>
      </ScrollView>
    </Box>
  );
}
