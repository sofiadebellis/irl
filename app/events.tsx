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
import { isAvailable, sortEvents } from "@/helpers";
import SearchBar from "./components/bars/searchBar";

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<Filters>({} as Filters);
  const [sort, setSort] = useState<Sort>(Sort.DATE);
  const [availability, setAvailability] = useState<boolean[][]>(
    Array(7)
      .fill(null)
      .map(() => Array(24).fill(false)),
  );

  const [events, setEvents] = useState<Event[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const isRSVPd = (userEvents: UserEvent[], event: Event) => {
    return (
      userEvents.find((userEvent) => userEvent["id"] === event["id"]) !==
      undefined
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

        if (filters) {
          if (filters["rsvp"] === true && !isRSVPd(userEvents, event)) {
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

          // TODO distance filter
        }

        return true;
      });
    }

    setFilteredEvents(sortEvents(tempFilteredEvents, sort));
  };

  useEffect(() => {
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
      }

      const tempFilters = filters && JSON.parse(filters);

      setFilters(tempFilters);
      setLoading(false);
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
          <SortButton updateSort={setSort} />
          <FilterButton updateFilters={setFilters} />
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
                      distance={Distance.ONE} // TODO distance of events
                      condensed={false}
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
