import React, { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Chat,
  Distance,
  Event,
  EventType,
  Sort,
  Status,
  User,
  UserChat,
  UserEvent,
} from "@/types";
import EventCard from "./components/cards/eventCard";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import DashboardCard from "./components/cards/dashboardCard";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { AddIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Search } from "lucide-react-native";
import { router } from "expo-router";
import {
  getOtherMemberName,
  getPrivateChatCoverPhoto,
  isAvailable,
  sortEvents,
} from "@/helpers";
import ChatCard from "./components/cards/chatCard";

type ChatCard = {
  chats: Chat[];
  filterCondition?: (chat: Chat) => boolean | undefined;
  errorMsg: string;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [availability, setAvailability] = useState<boolean[][]>(
    Array(7)
      .fill(null)
      .map(() => Array(24).fill(false)),
  );
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [interestedAndGoing, setInterestedAndGoing] = useState<Event[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);

  const [allUserDetails, setAllUserDetails] = useState<User[]>([]);
  const [currUser, setCurrUser] = useState<User>();
  const [chatDetails, setChatDetails] = useState<Chat[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      const jsonData = await AsyncStorage.getItem("data");
      const userID = await AsyncStorage.getItem("userID");

      if (userID && jsonData) {
        const data = JSON.parse(jsonData);
        const user = data.Users.find((user: User) => user.id === userID);

        const userEvents = user["events"];
        const tempInterestedAndGoing: Event[] = [];
        const tempRecommended: Event[] = [];
        const tempPast: Event[] = [];
        const tempCreated: Event[] = [];

        sortEvents(data["Events"], Sort.DATE, {}).forEach((event: Event) => {
          const { id, category, start } = event;
          const responded = userEvents.find(
            (userEvent: UserEvent) => userEvent["id"] === id,
          );
          const interestCategories = user["interest"];
          if (
            responded &&
            (responded["type"] === EventType.PAST ||
              new Date(start) < new Date())
          ) {
            tempPast.push(event);
          } else if (responded && responded["type"] === EventType.CREATED) {
            tempCreated.push(event);
          } else if (
            responded &&
            responded["type"] === EventType.RSVP &&
            responded["status"] !== Status.CANT_GO
          ) {
            tempInterestedAndGoing.push(event);
          } else if (
            interestCategories.includes(category) &&
            isAvailable(event["start"], user["availability"])
          ) {
            tempRecommended.push(event);
          }
        });

        setUserEvents(userEvents);
        setInterestedAndGoing(tempInterestedAndGoing);
        setRecommendedEvents(tempRecommended);
        setPastEvents(tempPast);
        setCreatedEvents(tempCreated);

        setName(user["name"]);
        setAvailability(user["availability"]);
        setLoading(false);
      }
    };

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

          setChatDetails([...userEventChats, ...userPrivateChats]);
        }
      } catch (error) {
        console.error("Failed to load chats data:", error);
      }
    };

    loadChats();
    getEvents();
  }, []);

  const renderEvent = (
    event: Event,
    status: Status,
    index: number,
    includeCategory: boolean,
  ) => {
    const { id, name, coverPhoto, start, category, price } = event;
    return (
      <Box key={index} className="w-72">
        <EventCard
          id={id}
          name={name}
          coverPhoto={coverPhoto}
          start={start}
          status={status}
          category={category}
          price={price}
          distance={Distance.ONE} // distance is not shown on condensed cards
          condensed
          condensedCategory={includeCategory}
          availability={availability}
        />
      </Box>
    );
  };

  const renderChat = (chat: Chat, index: number) => {
    return (
      <Box key={index} className="w-72">
        <ChatCard
          chatId={chat.id}
          name={
            chat.name === ""
              ? getOtherMemberName(chat, currUser?.id!, allUserDetails)
              : chat.name
          }
          coverPhoto={
            chat.coverPhoto === ""
              ? getPrivateChatCoverPhoto(chat, currUser?.id!, allUserDetails)
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
      </Box>
    );
  };

  return (
    <Box className="flex-1 p-5 relative" style={{ backgroundColor: "#FFFFFF" }}>
      <Fab
        size="lg"
        style={{ position: "absolute", bottom: 60 }}
        onPress={() => router.navigate("/create-event")}
      >
        <FabIcon as={AddIcon} />
        <FabLabel>Create Event</FabLabel>
      </Fab>
      {loading ? (
        <Box className="m-40">
          <Spinner size="large" />
        </Box>
      ) : (
        <ScrollView>
          <VStack space="2xl" style={{ paddingBottom: 150 }}>
            <Heading size="2xl">{`Welcome${
              name.length > 0 ? `, ${name}` : ""
            }!`}</Heading>
            <HStack space="lg">
              <DashboardCard
                heading="Events Attended"
                number={pastEvents.length}
              />
              <DashboardCard
                heading="Events Created"
                number={createdEvents.length}
              />
            </HStack>
            <VStack space="sm">
              <Heading size="xl">Created by You</Heading>
              {createdEvents.length > 0 ? (
                <ScrollView
                  horizontal
                  alwaysBounceHorizontal={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <HStack space="md" className="items-center">
                    {createdEvents.map((event, index) => {
                      const { id } = event;
                      const status = userEvents.find(
                        (userEvent) => userEvent["id"] === id,
                      )?.status;

                      return status && renderEvent(event, status, index, false);
                    })}
                  </HStack>
                </ScrollView>
              ) : (
                <Box className="m-5">
                  <Text size="xl" style={{ color: "#9c9c9c" }}>
                    You have not created any events. Tap{" "}
                    <Box
                      style={{
                        paddingBottom: 17,
                      }}
                    >
                      <Icon
                        as={AddIcon}
                        size="xl"
                        style={{ position: "absolute", color: "#9c9c9c" }}
                      />
                    </Box>
                    {"      "}
                    Create Event below to get started.
                  </Text>
                </Box>
              )}
            </VStack>
            <VStack space="sm">
              <Heading size="xl">Going and Interested</Heading>
              {interestedAndGoing.length > 0 ? (
                <ScrollView
                  horizontal
                  alwaysBounceHorizontal={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <HStack space="md" className="items-center">
                    {interestedAndGoing.map((event, index) => {
                      const { id } = event;
                      const status = userEvents.find(
                        (userEvent) => userEvent["id"] === id,
                      )?.status;

                      return status && renderEvent(event, status, index, false);
                    })}
                  </HStack>
                </ScrollView>
              ) : (
                <Box className="m-5">
                  <Text size="xl" style={{ color: "#9c9c9c" }}>
                    Tap{" "}
                    <Box
                      style={{
                        paddingBottom: 17,
                      }}
                    >
                      <Icon
                        as={Search}
                        size="xl"
                        style={{ position: "absolute", color: "#9c9c9c" }}
                      />
                    </Box>
                    {"      "}
                    below to browse events. Events you RSVP to as 'Going' or
                    'Interested' will appear here.
                  </Text>
                </Box>
              )}
            </VStack>
            {chatDetails.length > 0 && (
              <VStack space="sm">
                <Heading size="xl">Continue Chatting</Heading>

                <ScrollView
                  horizontal
                  alwaysBounceHorizontal={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <HStack space="md" className="text-lg items-center">
                    {chatDetails
                      .filter((chat) => !chat.archived)
                      .map((chat: Chat, index) => renderChat(chat, index))}
                  </HStack>
                </ScrollView>
              </VStack>
            )}
            {recommendedEvents.length > 0 && (
              <VStack space="sm">
                <Heading size="xl">
                  Based on Your Interests and Availability
                </Heading>

                <ScrollView
                  horizontal
                  alwaysBounceHorizontal={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <HStack space="md" className="items-center">
                    {recommendedEvents.map((event, index) =>
                      renderEvent(event, Status.NONE, index, true),
                    )}
                  </HStack>
                </ScrollView>
              </VStack>
            )}
            {chatDetails.filter((chat) => chat.archived).length > 0 && (
              <VStack space="sm">
                <Heading size="xl">Connect From Past Events</Heading>

                <ScrollView
                  horizontal
                  alwaysBounceHorizontal={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <HStack space="md" className="text-lg items-center">
                    {chatDetails
                      .filter((chat) => chat.archived)
                      .map((chat: Chat, index) => renderChat(chat, index))}
                  </HStack>
                </ScrollView>
              </VStack>
            )}
            {pastEvents.length > 0 && (
              <VStack space="sm">
                <Heading size="xl">Past Events</Heading>
                <ScrollView
                  horizontal
                  alwaysBounceHorizontal={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <HStack space="md" className="items-center">
                    {pastEvents.map((event, index) =>
                      renderEvent(event, Status.NONE, index, false),
                    )}
                  </HStack>
                </ScrollView>
              </VStack>
            )}
          </VStack>
        </ScrollView>
      )}
    </Box>
  );
}
