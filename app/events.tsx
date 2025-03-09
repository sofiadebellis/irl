import React, { useEffect, useState } from "react";
import EventCard from "./components/cards/eventCard";
import {
  Distance,
  Event,
  Filters,
  Sort,
  Status,
  User,
  UserEvent,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { ButtonGroup } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import FilterButton from "./components/buttons/filterButton";
import SortButton from "./components/buttons/sortButton";
import { findDistance, isAvailable, sortEvents } from "@/helpers";
import SearchBar from "./components/bars/searchBar";

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<Filters>({} as Filters);
  const [sort, setSort] = useState<Sort>(Sort.DATE);
  const [distanceMap, setDistanceMap] = useState<{
    [key: string]: Distance | undefined;
  }>({});
  const [availability, setAvailability] = useState<boolean[][]>(
    Array(7)
      .fill(null)
      .map(() => Array(24).fill(false)),
  );

  const [events, setEvents] = useState<Event[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const cantGoEvent = (userEvents: UserEvent[], event: Event) => {
    return (
      userEvents.find((userEvent) => userEvent["id"] === event["id"])
        ?.status === Status.CANT_GO
    );
  };

  const isSearched = (event: Event) => {
    return (
      event["name"].toLowerCase().includes(searchValue.toLowerCase()) ||
      event["category"].toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const filterEvents = (
    events: Event[],
    userEvents: UserEvent[],
    searchValue: string,
    filters: Filters,
    sort: Sort,
    availability: boolean[][],
  ) => {
    // filter events according to search bar, filters and sorting
    let tempFilteredEvents = [...events];

    if (events.length > 0) {
      tempFilteredEvents = tempFilteredEvents.filter((event) => {
        if (searchValue.length > 0 && !isSearched(event)) {
          return false;
        }
        if (new Date(event["start"]) < new Date()) {
          // don't show past events
          return false;
        }

        if (filters) {
          if (filters["cantGo"] === true && cantGoEvent(userEvents, event)) {
            return false;
          }
          if (
            filters["availability"] === true &&
            !isAvailable(event["start"], availability)
          ) {
            return false;
          }
          if (
            !filters["category"]?.includes(event["category"]) ||
            !filters["price"]?.includes(event["price"])
          ) {
            return false;
          }

          const noLocation = Object.keys(distanceMap).length === 0;
          if (!noLocation) {
            const distance = distanceMap[event["id"]];
            if (
              distance !== undefined &&
              !filters["distance"]?.includes(distance)
            ) {
              return false;
            }
          }
        }

        return true;
      });
    }
    setFilteredEvents(sortEvents(tempFilteredEvents, sort, distanceMap));
  };

  useEffect(() => {
    const getDistanceData = async (events: Event[], userLocation: string) => {
      const distancePromises = events.map(async (event) => {
        const { id, location } = event;
        const distance = await findDistance(userLocation, location["id"]);
        return { id, distance };
      });

      const distances = await Promise.all(distancePromises);

      const tempDistanceMap = distances.reduce<
        Record<string, Distance | undefined>
      >((acc, { id, distance }) => {
        acc[id] = distance;
        return acc;
      }, {});

      setDistanceMap(tempDistanceMap);
      setLoading(false);
    };

    const getEvents = async () => {
      const storedData = await AsyncStorage.getItem("data");
      const userID = await AsyncStorage.getItem("userID");
      const filters = await AsyncStorage.getItem("filters");
      storedData && setEvents(JSON.parse(storedData)["Events"]);

      if (storedData && userID) {
        const user = JSON.parse(storedData)["Users"].find(
          (user: User) => user.id === userID,
        );
        setUserEvents(user["events"]);
        setAvailability(user["availability"]);

        if (Object.keys(user["location"]).length !== 0) {
          getDistanceData(
            JSON.parse(storedData)["Events"],
            user["location"]["id"],
          );
          const tempFilters = filters && JSON.parse(filters);
          setFilters(tempFilters);
        } else {
          const tempFilters = filters && JSON.parse(filters);
          setFilters(tempFilters);
          setLoading(false);
        }
      }
    };

    getEvents();
  }, []);

  useEffect(() => {
    filterEvents(events, userEvents, searchValue, filters, sort, availability);
  }, [events, userEvents, searchValue, filters, sort, availability]);

  return (
    <Box className="flex-1 bg-gray-50 p-5">
      <VStack space="md">
        <SearchBar
          placeholder="Search for events..."
          searchQuery={searchValue}
          setSearchQuery={setSearchValue}
        />
        <ButtonGroup space="md">
          <SortButton
            updateSort={setSort}
            disableDistance={Object.keys(distanceMap).length === 0}
          />
          <FilterButton
            updateFilters={setFilters}
            disableDistance={Object.keys(distanceMap).length === 0}
          />
        </ButtonGroup>

        {loading ? (
          <Box className="m-40">
            <Spinner size="large" />
          </Box>
        ) : (
          <ScrollView className="h-full">
            <VStack
              space="md"
              className="flex-1"
              style={{ paddingBottom: 200 }}
            >
              {filteredEvents.map((event, index) => {
                const { id, name, coverPhoto, start, category, price } = event;
                const userRespondedEvent = userEvents.find(
                  (userEvent) => userEvent["id"] === id,
                );
                const past = userRespondedEvent?.status === Status.WENT;
                const noLocation = Object.keys(distanceMap).length === 0;

                return (
                  !past && (
                    <EventCard
                      id={id}
                      key={index}
                      name={name}
                      coverPhoto={coverPhoto}
                      start={start}
                      status={
                        userRespondedEvent
                          ? userRespondedEvent["status"]
                          : Status.NONE
                      }
                      category={category}
                      price={price}
                      distance={noLocation ? undefined : distanceMap[id]}
                      condensed={false}
                      condensedCategory={false}
                      availability={availability}
                    />
                  )
                );
              })}
            </VStack>
          </ScrollView>
        )}
      </VStack>
    </Box>
  );
}
