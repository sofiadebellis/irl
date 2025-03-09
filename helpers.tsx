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
} from "./types";

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

export const sortEvents = (events: Event[], sort: Sort) => {
  return events.sort((a, b) => {
    switch (sort) {
      // TODO distance sorting
      case Sort.PRICE_ASC:
        return priceOrderMap[a["price"]] - priceOrderMap[b["price"]];
      case Sort.PRICE_DES:
        return priceOrderMap[b["price"]] - priceOrderMap[a["price"]];
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
