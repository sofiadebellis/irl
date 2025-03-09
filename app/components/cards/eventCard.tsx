import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import StatusBadge from "../badges/statusBadge";
import { Distance, EventCategory, EventPrice, Status } from "@/types";
import EventCategoryBadge from "../badges/eventCategoryBadge";
import EventPriceBadge from "../badges/eventPriceBadge";
import DistanceBadge from "../badges/distanceBadge";
import DateBadge from "../badges/dateBadge";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ImageBackground } from "@/components/ui/image-background";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import { Pressable } from "@/components/ui/pressable";
import { Box } from "@/components/ui/box";
import { isAvailable } from "@/helpers";

interface EventCardProps {
  id: string;
  name: string;
  coverPhoto: string;
  start: string;
  status: Status;
  category: EventCategory;
  price: EventPrice;
  distance: Distance;
  condensed: boolean;
  availability: boolean[][];
}

export default function EventCard({
  id,
  name,
  coverPhoto,
  start,
  status,
  category,
  price,
  distance,
  condensed,
  availability,
}: EventCardProps) {
  return (
    <Pressable
      key={id}
      onPress={() =>
        router.push(
          `/view-event?id=${id}&available=${isAvailable(start, availability)}`,
        )
      }
    >
      <Card variant="outline" className="p-0 bg-white w-full">
        <HStack space="xs" className="w-full">
          <ImageBackground
            source={{
              uri: coverPhoto,
            }}
            resizeMode="cover"
            className="w-24"
            imageStyle={{ borderRadius: 4 }}
          />
          <VStack space="sm" className="p-3 flex-1">
            <Box className="min-h-16 justify-center">
              <Heading size="lg" numberOfLines={2} isTruncated>
                {name}
              </Heading>
            </Box>
            {condensed ? (
              <>
                <DateBadge
                  date={start}
                  available={isAvailable(start, availability)}
                />
                <StatusBadge status={status} />
              </>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                alwaysBounceHorizontal={false}
              >
                <HStack space="sm">
                  <DateBadge
                    date={start}
                    available={isAvailable(start, availability)}
                  />
                  <StatusBadge status={status} />
                </HStack>
              </ScrollView>
            )}
            {!condensed && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                alwaysBounceHorizontal={false}
              >
                <HStack space="sm">
                  <EventCategoryBadge eventCategory={category} />
                  <EventPriceBadge eventPrice={price} />
                  <DistanceBadge distance={distance} />
                </HStack>
              </ScrollView>
            )}
          </VStack>
        </HStack>
      </Card>
    </Pressable>
  );
}
