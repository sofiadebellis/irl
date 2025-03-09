import React, { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Distance,
  Event,
  EventType,
  Sort,
  Status,
  User,
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
import { isAvailable, sortEvents } from "@/helpers";

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

        sortEvents(data["Events"], Sort.DATE).forEach((event: Event) => {
          const { id, category } = event;
          const responded = userEvents.find(
            (userEvent: UserEvent) => userEvent["id"] === id,
          );
          const interestCategories = user["interest"];
          if (responded && responded["type"] === EventType.PAST) {
            tempPast.push(event);
          } else if (responded && responded["type"] === EventType.RSVP) {
            tempInterestedAndGoing.push(event);
          } else if (responded && responded["type"] === EventType.CREATED) {
            tempCreated.push(event);
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

    getEvents();
  }, []);

  const renderEvent = (event: Event, status: Status, index: number) => {
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
          distance={Distance.ONE} // TODO distance of events
          condensed
          availability={availability}
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
                      return renderEvent(event, Status.GOING, index);
                    })}
                  </HStack>
                </ScrollView>
              ) : (
                <Box className="m-5">
                  <Text size="xl">
                    You have not created any events. Tap{" "}
                    <Icon as={AddIcon} size="xl" /> Create Event below to get
                    started.
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

                      return status && renderEvent(event, status, index);
                    })}
                  </HStack>
                </ScrollView>
              ) : (
                <Box className="m-5">
                  <Text size="xl">
                    Tap <Icon as={Search} size="xl" /> below to browse events.
                    Events you RSVP to as 'Going' or 'Interested' will appear
                    here.
                  </Text>
                </Box>
              )}
            </VStack>
            {/*TODO need message component <VStack space="sm">
              <Heading size="xl">Jump Back In</Heading>

            </VStack> */}

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
                      renderEvent(event, Status.NONE, index),
                    )}
                  </HStack>
                </ScrollView>
              </VStack>
            )}
            {/* TODO need profile component <VStack space="sm">
              <Heading size="xl">Connect From Past Events</Heading>
            </VStack> */}
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
                      renderEvent(event, Status.NONE, index),
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
