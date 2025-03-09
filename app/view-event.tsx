import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Fab, FabIcon } from "@/components/ui/fab";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  CloseIcon,
  Icon,
  MailIcon,
} from "@/components/ui/icon";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateBadge from "./components/badges/dateBadge";
import {
  Chat,
  Distance,
  Event,
  Status,
  User,
  UserChat,
  UserEvent,
} from "@/types";
import { Spinner } from "@/components/ui/spinner";
import EventCategoryBadge from "./components/badges/eventCategoryBadge";
import { HStack } from "@/components/ui/hstack";
import EventPriceBadge from "./components/badges/eventPriceBadge";
import DistanceBadge from "./components/badges/distanceBadge";
import { Image } from "react-native";
import { Box } from "@/components/ui/box";
import { getUserEventStatus } from "@/helpers";
import StatusBadge from "./components/badges/statusBadge";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  Crown,
  Info,
  ListCollapse,
  Lock,
  MapPin,
  MessageCircle,
  Pencil,
  TrashIcon,
} from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetItem,
} from "@/components/ui/actionsheet";
import {
  Popover,
  PopoverBackdrop,
  PopoverBody,
  PopoverContent,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";

export default function ViewEvent() {
  const { id, available } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [host, setHost] = useState<User>();
  const [rsvpStatus, setRsvpStatus] = useState<Status>(Status.NONE);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const { width: screenWidth } = Dimensions.get("window");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [userID, setUserID] = useState<string>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const jsonData = await AsyncStorage.getItem("data");
        const userId = await AsyncStorage.getItem("userID");
        const data = jsonData
          ? JSON.parse(jsonData)
          : { Events: [], Users: [] };

        userId ? setUserID(userId) : console.error("No user ID found");

        const foundEvent = data.Events.find((event: Event) => event.id === id);
        if (foundEvent) {
          setEvent(foundEvent);

          const host = data.Users.find(
            (user: User) => user.id === foundEvent.host
          );

          host ? setHost(host) : console.error("Host not found");
        } else {
          console.error("Event not found");
        }
        const status = getUserEventStatus(userId as string, id as string, data);
        setRsvpStatus(status);
      } catch (error) {
        console.error("Error loading event data:", error);
      }
    };

    loadEventData();
  }, [id]);

  const handleRSVPChange = async (status: Status) => {
    setRsvpStatus(status);
    setIsActionSheetOpen(false);

    try {
      const jsonData = await AsyncStorage.getItem("data");
      const data = jsonData ? JSON.parse(jsonData) : { Users: [], Events: [] };
      const userId = await AsyncStorage.getItem("userID");

      if (userId) {
        const userIndex = data.Users.findIndex(
          (user: User) => user.id === userId
        );

        if (userIndex !== -1) {
          const eventIndex = data.Users[userIndex].events.findIndex(
            (userEvent: UserEvent) => userEvent.id === id
          );

          if (eventIndex !== -1) {
            data.Users[userIndex].events[eventIndex].status = status;
          } else {
            data.Users[userIndex].events.push({ id, status, type: "RSVPd" });
          }

          const event = data.Events.find((event: Event) => event.id === id);
          if (event) {
            const eventName = event.name;

            if (
              !data.Users[userIndex].chats.find((chat: Chat) => chat.id === id)
            ) {
              data.Users[userIndex].chats.push({
                id,
                name: eventName,
                groupChat: true,
                archived: false,
              });
            }
          } else {
            console.error("Event not found in Events list");
          }

          await AsyncStorage.setItem("data", JSON.stringify(data));
        } else {
          console.error("User not found");
        }
      }
    } catch (error) {
      console.error("Error updating RSVP status:", error);
    }
  };
  const handlePopoverOpen = () => {
    setIsPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
  };

  const handlePopoverToggle = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const getRSVPButtonIcon = (status: Status) => {
    switch (status) {
      case Status.GOING:
        return CheckCircleIcon;
      case Status.INTERESTED:
        return AlertCircleIcon;
      case Status.CANT_GO:
        return CloseCircleIcon;
      default:
        return MailIcon;
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const jsonData = await AsyncStorage.getItem("data");
      const data = jsonData
        ? JSON.parse(jsonData)
        : { Events: [], Users: [], GroupChats: [] };

      const eventToDelete = data.Events.find((e: Event) => e.id === id);
      if (!eventToDelete) {
        console.error("Event not found");
        return;
      }

      const updatedEvents = data.Events.filter((e: Event) => e.id !== id);

      const updatedGroupChats = data.GroupChats.filter(
        (chat: Chat) => chat.id !== eventToDelete.groupChat
      );

      const updatedUsers = data.Users.map((user: User) => ({
        ...user,
        events: user.events.filter(
          (userEvent: UserEvent) => userEvent.id !== id
        ),
        chats: user.chats.filter(
          (userChat: UserChat) => userChat.id !== eventToDelete.groupChat
        ),
      }));

      const updatedData = {
        ...data,
        Events: updatedEvents,
        Users: updatedUsers,
        GroupChats: updatedGroupChats,
      };

      await AsyncStorage.setItem("data", JSON.stringify(updatedData));

      console.log("Event and associated group chat deleted successfully.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting event and group chat:", error);
    }
  };

  if (!event) {
    return (
      <Box className="h-full bg-white">
        <Spinner size="large" className="m-40" />
      </Box>
    );
  }

  return (
    <Box className="h-full">
      <Fab
        placement="top left"
        onPress={() => router.back()}
        className="border border-black bg-white p-2 active:bg-white focus:bg-white"
        style={{ position: "absolute", zIndex: 1, height: 50, width: 50 }}
      >
        <FabIcon
          as={ArrowLeftIcon}
          onPress={() => router.back()}
          size="xl"
          className="text-black"
        />
      </Fab>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <Center className="bg-white">
          <Image
            style={{
              width: screenWidth,
              height: 200,
              resizeMode: "cover",
            }}
            source={{
              uri: event.coverPhoto,
            }}
            alt="Event cover"
          />
          <Box className="w-full">
            <VStack space="xl" className="m-5">
              <HStack className="justify-between flex-row w-full">
                <DateBadge date="2021-12-25" available={true} />
                {host?.id === userID && (
                  <TouchableOpacity onPress={() => setIsModalOpen(true)}>
                    <Icon
                      as={TrashIcon}
                      style={{ height: 25, width: 25 }}
                      className="text-error-400"
                    />
                  </TouchableOpacity>
                )}
              </HStack>
              <Heading size="3xl">{event.name}</Heading>
              <HStack>
                <Text size="xl">Public event by </Text>
                <Pressable
                  onPress={() => router.push(`/view-user?id=${host?.id}`)}
                >
                  <HStack space="xs">
                    <Avatar size="sm">
                      <AvatarImage
                        source={{
                          uri:
                            host?.image ||
                            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
                        }}
                      />
                    </Avatar>
                    <Text className="text-link-500 underline" size="xl">
                      {host?.name}
                    </Text>
                  </HStack>
                </Pressable>
              </HStack>
              <HStack space="sm">
                <EventCategoryBadge eventCategory={event.category} />
                <EventPriceBadge eventPrice={event.price} />
                <DistanceBadge distance={Distance.ONE} />
                {rsvpStatus !== Status.NONE && (
                  <StatusBadge status={rsvpStatus} />
                )}
              </HStack>
              {host?.id === userID ? (
                <Button
                  size="xl"
                  onPress={() => router.push(`/edit-event?id=${event.id}`)}
                >
                  <ButtonIcon as={Pencil} />
                  <ButtonText>Edit event</ButtonText>
                </Button>
              ) : (
                <Button size="xl">
                  {/* TODO: Link to messages */}
                  <ButtonIcon as={Crown} />
                  <ButtonText>Message host</ButtonText>
                </Button>
              )}
              {rsvpStatus !== Status.NONE &&
              rsvpStatus !== Status.CANT_GO &&
              rsvpStatus !== Status.INTERESTED ? (
                // TODO: Link to messages
                <Button size="xl" variant="outline">
                  <ButtonIcon as={MessageCircle} />
                  <ButtonText>Group chat</ButtonText>
                </Button>
              ) : (
                <HStack
                  style={{
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    size="xl"
                    variant="outline"
                    isDisabled={true}
                    className="flex-1"
                  >
                    <ButtonIcon as={Lock} />
                    <ButtonText>Group Chat</ButtonText>
                  </Button>
                  <Popover
                    isOpen={isPopoverOpen}
                    onClose={handlePopoverClose}
                    onOpen={handlePopoverOpen}
                    placement="bottom"
                    size="full"
                    trigger={(triggerProps) => {
                      return (
                        <Button
                          {...triggerProps}
                          onPress={handlePopoverToggle}
                          style={{ height: 30, width: 30 }}
                          variant="link"
                          className="ml-5"
                        >
                          <ButtonIcon
                            as={Info}
                            style={{ height: 30, width: 30 }}
                          />
                        </Button>
                      );
                    }}
                  >
                    <PopoverBackdrop />
                    <PopoverContent style={{ maxWidth: 200, marginRight: 10 }}>
                      <PopoverBody>
                        <Text size="xl">
                          You must RSVP to this event to get access to the group
                          chat.
                        </Text>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </HStack>
              )}
              <Divider />
              <HStack className="items-center" space="sm">
                <Icon size="xl" as={MapPin} />
                <Heading size="2xl">Location</Heading>
              </HStack>
              <Text size="xl">{event.location}</Text>
              <HStack className="items-center" space="sm">
                <Icon size="xl" as={ListCollapse} />
                <Heading size="2xl">Description and Details</Heading>
              </HStack>
              <Text size="xl">{event.description}</Text>
            </VStack>
          </Box>
        </Center>
      </ScrollView>

      <Box
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: 10,
          backgroundColor: "white",
        }}
      >
        <Button
          size="xl"
          className="bg-tertiary-400"
          style={{ bottom: 50 }}
          onPress={() => setIsActionSheetOpen(true)}
        >
          <ButtonIcon as={getRSVPButtonIcon(rsvpStatus)} />
          <ButtonText>
            {rsvpStatus === Status.NONE ? "RSVP" : rsvpStatus}
          </ButtonText>
        </Button>

        <Actionsheet
          isOpen={isActionSheetOpen}
          onClose={() => setIsActionSheetOpen(false)}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <Heading
              style={{
                textAlign: "left",
                width: "100%",
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 10,
              }}
              size="2xl"
            >
              RSVP Status
            </Heading>
            <Divider />
            <ActionsheetItem
              onPress={() => handleRSVPChange(Status.GOING)}
              className={rsvpStatus === Status.GOING ? "bg-secondary-100" : ""}
            >
              <Text size="xl">Going</Text>
            </ActionsheetItem>
            <ActionsheetItem
              onPress={() => handleRSVPChange(Status.INTERESTED)}
              className={
                rsvpStatus === Status.INTERESTED ? "bg-secondary-100" : ""
              }
            >
              <Text size="xl">Interested</Text>
            </ActionsheetItem>
            <ActionsheetItem
              onPress={() => handleRSVPChange(Status.CANT_GO)}
              className={
                rsvpStatus === Status.CANT_GO ? "bg-secondary-100" : ""
              }
            >
              <Text size="xl">Can't Go</Text>
            </ActionsheetItem>
          </ActionsheetContent>
        </Actionsheet>
      </Box>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="2xl">Delete event confirmation</Heading>
            <ModalCloseButton onPress={() => setIsModalOpen(false)}>
              <Icon
                as={CloseIcon}
                size="xl"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text size="xl">Are you sure you want to delete this event?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              size="xl"
              onPress={() => {
                setIsModalOpen(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setIsModalOpen(false);
                handleDeleteEvent();
              }}
              size="xl"
              className="bg-tertiary-400"
            >
              <ButtonText>Delete event</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
