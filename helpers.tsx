import { CheckIcon, SlashIcon, StarIcon, PlayIcon } from "@/components/ui/icon";
import {
  DumbbellIcon,
  HeartHandshakeIcon,
  PaletteIcon,
  PlaneIcon,
  PuzzleIcon,
  UtensilsIcon,
} from "lucide-react-native";
import {
  Distance,
  EventCategory,
  Event,
  EventPrice,
  User,
  Status,
  Sort,
  Chat,
} from "./types";
import { getDistance } from "geolib";

import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const GOOGLE_MAPS_API_KEY = "AIzaSyAumIUTRarFQUk0xZXqwIeFj9FEq-k9lVo";

export const categoryIconMap: Record<EventCategory, React.ElementType> = {
  [EventCategory.ENTERTAINMENT]: PlayIcon,
  [EventCategory.CREATIVE]: PaletteIcon,
  [EventCategory.FOOD_RELATED]: UtensilsIcon,
  [EventCategory.FITNESS]: DumbbellIcon,
  [EventCategory.PUZZLES]: PuzzleIcon,
  [EventCategory.TRAVEL]: PlaneIcon,
  [EventCategory.CHARITY]: HeartHandshakeIcon,
};

export const statusIconMap: Record<Status, React.ElementType | undefined> = {
  [Status.GOING]: CheckIcon,
  [Status.INTERESTED]: StarIcon,
  [Status.CANT_GO]: SlashIcon,
  [Status.WENT]: CheckIcon,
  [Status.NONE]: undefined,
};

export const distanceTextMap: Record<Distance, string> = {
  [Distance.ONE]: "< 1km",
  [Distance.FIVE]: "< 5km",
  [Distance.TEN]: "< 10km",
  [Distance.TWENTY_FIVE]: "< 25km",
  [Distance.FIFTY]: "< 50km",
  [Distance.OVER_FIFTY]: "50+ km",
};

export const priceTextMap: Record<EventPrice, string> = {
  [EventPrice.FREE]: "Free",
  [EventPrice.LOW]: "$",
  [EventPrice.MED]: "$$",
  [EventPrice.HIGH]: "$$$",
};

export const priceLabelMap: Record<EventPrice, string> = {
  [EventPrice.FREE]: "Free",
  [EventPrice.LOW]: "$0-$20",
  [EventPrice.MED]: "$20-$50",
  [EventPrice.HIGH]: "$50+",
};

export const priceOrderMap: Record<EventPrice, number> = {
  [EventPrice.FREE]: 0,
  [EventPrice.LOW]: 1,
  [EventPrice.MED]: 2,
  [EventPrice.HIGH]: 3,
};

export const distanceOrderMap: Record<Distance, number> = {
  [Distance.ONE]: 0,
  [Distance.FIVE]: 1,
  [Distance.TEN]: 2,
  [Distance.TWENTY_FIVE]: 3,
  [Distance.FIFTY]: 4,
  [Distance.OVER_FIFTY]: 5,
};

// Helper function to get user's RSVP status for a specific event
export function getUserEventStatus(
  userId: string,
  eventId: string,
  data: any,
): Status {
  const user = data.Users.find((user: User) => user.id === userId);
  if (!user) {
    return Status.NONE;
  }
  const userEvent = user.events.find((event: Event) => event.id === eventId);
  return userEvent ? userEvent.status : Status.NONE;
}

export const sortEvents = (
  events: Event[],
  sort: Sort,
  distanceMap: {
    [key: string]: Distance | undefined;
  },
) => {
  return events.sort((a, b) => {
    const noLocation = Object.keys(distanceMap).length === 0;

    switch (sort) {
      case Sort.PRICE_ASC:
        return priceOrderMap[a["price"]] - priceOrderMap[b["price"]];
      case Sort.PRICE_DES:
        return priceOrderMap[b["price"]] - priceOrderMap[a["price"]];
      case Sort.DISTANCE_ASC:
        if (!noLocation) {
          const distance1 = distanceMap[a["id"]];
          const distance2 = distanceMap[b["id"]];

          if (distance1 !== undefined && distance2 !== undefined) {
            return distanceOrderMap[distance1] - distanceOrderMap[distance2];
          }
        }
      case Sort.DISTANCE_DES:
        if (!noLocation) {
          const distance1 = distanceMap[a["id"]];
          const distance2 = distanceMap[b["id"]];

          if (distance1 !== undefined && distance2 !== undefined) {
            return distanceOrderMap[distance2] - distanceOrderMap[distance1];
          }
        }
      default:
        return new Date(a["start"]).getTime() - new Date(b["start"]).getTime();
    }
  });
};

export const isAvailable = (start: string, availability: boolean[][]) => {
  if (availability === undefined) {
    return undefined;
  }
  const startDate = new Date(start);
  return availability[startDate.getDay()][startDate.getHours()];
};

export const getOtherMemberName = (
  chat: Chat,
  currUserId: string,
  allUserDetails: User[],
) => {
  const otherMemberId = chat.members.find((member) => member !== currUserId);
  const otherMember = allUserDetails.find((user) => user.id === otherMemberId);
  return otherMember ? otherMember.name : "Unknown";
};

export const getPrivateChatCoverPhoto = (
  chat: Chat,
  currUserId: string,
  allUserDetails: User[],
) => {
  const otherMemberId = chat.members.find((member) => member !== currUserId);
  const otherMember = allUserDetails.find((user) => user.id === otherMemberId);
  return otherMember ? otherMember.image : "";
};

export const getHostChatData = async (
  allUserData: any,
  hostId: string | undefined,
  currUserId: string,
) => {
  try {
    const data = allUserData;
    const adminId = hostId ? hostId : "";

    const chat = data.PrivateChats.find(
      (chat: Chat) =>
        chat.members.includes(currUserId) &&
        chat.members.includes(adminId) &&
        chat.groupChat === false,
    );

    if (chat) {
      return `/chat?chatId=${chat.id}&chatName=${chat.name}`;
    } else {
      const newPrivChat = {
        id: uuidv4(),
        name: "",
        coverPhoto: "",
        members: [currUserId, adminId],
        messages: [],
        groupChat: false,
      };

      data.PrivateChats.push(newPrivChat);

      // add user chat to both admin and curr user
      data.Users[
        data.Users.findIndex((user: User) => user.id === currUserId)
      ].chats.push({
        id: newPrivChat.id,
        name: "",
        groupChat: false,
      });

      data.Users[
        data.Users.findIndex((user: User) => user.id === adminId)
      ].chats.push({
        id: newPrivChat.id,
        name: "",
        groupChat: false,
      });

      await AsyncStorage.setItem("data", JSON.stringify(data));
      return `/chat?chatId=${newPrivChat.id}&chatName=${newPrivChat.name}`;
    }
  } catch {
    console.error("Error getting host chat data");
  }
};

const getCoordinates = async (placeId: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const { lat, lng } = data.result.geometry.location;
    return { lat, lng };
  } catch (error) {
    console.error("Error fetching place details:", error);
    throw new Error("Failed to fetch place details");
  }
};

export const findDistance = async (
  startLocation: string,
  endLocation: string,
) => {
  if (startLocation.length === 0) {
    return undefined;
  }

  try {
    const startCoords = await getCoordinates(startLocation);
    const endCoords = await getCoordinates(endLocation);

    const distance =
      getDistance(
        { latitude: startCoords.lat, longitude: startCoords.lng },
        { latitude: endCoords.lat, longitude: endCoords.lng },
      ) / 1000;

    if (distance !== undefined) {
      if (distance < 1) {
        return Distance.ONE;
      } else if (distance < 5) {
        return Distance.FIVE;
      } else if (distance < 10) {
        return Distance.TEN;
      } else if (distance < 25) {
        return Distance.TWENTY_FIVE;
      } else if (distance < 50) {
        return Distance.FIFTY;
      }
      return Distance.OVER_FIFTY;
    }

    return undefined;
  } catch (error) {
    console.error("Error calculating distance:", error);
  }
};
