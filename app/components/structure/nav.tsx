import React, { useEffect, useState } from "react";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { useRouter, usePathname } from "expo-router";
import { House, Search, MessageCircle } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);


  const isActive = (path: string) => pathname.includes(path);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        const dataJson = await AsyncStorage.getItem("data");
        if (userID && dataJson) {
          const data = JSON.parse(dataJson);
          const user = data.Users.find((u: any) => u.id === userID);
          if (user && user.image) {
            setProfileImage(user.image);
            setProfileName(user.name);
          }
        }
      } catch (error) {
        console.error("Failed to load profile image:", error);
      }
    };

    loadProfileImage();
  }, []);

  return (
    <HStack
      className="w-full bg-white items-center justify-around border-t border-gray-300"
      style={{ width: "100%", position: "absolute", bottom: 0, height: 80 }}
    >
      <Box
        className={`flex-1 items-center justify-center h-full ${
          isActive("/dashboard") ? "bg-tertiary-400" : ""
        }`}
      >
        <Pressable
          onPress={() => router.push("/dashboard")}
          className="items-center justify-center h-full w-full"
        >
          <Icon
            as={House}
            className={isActive("/dashboard") ? "text-white" : "text-black"}
            size="xl"
          />
        </Pressable>
      </Box>

      <Box
        className={`flex-1 items-center justify-center h-full ${
          isActive("/events") ? "bg-tertiary-400" : ""
        }`}
      >
        <Pressable
          onPress={() => router.push("/events")}
          className="items-center justify-center h-full w-full"
        >
          <Icon
            as={Search}
            className={isActive("/events") ? "text-white" : "text-black"}
            size="xl"
          />
        </Pressable>
      </Box>

      <Box
        className={`flex-1 items-center justify-center h-full ${
          isActive("/messages") ? "bg-tertiary-400" : ""
        }`}
      >
        <Pressable
          onPress={() => router.push("/messages")}
          className="items-center justify-center h-full w-full"
        >
          <Icon
            as={MessageCircle}
            className={isActive("/messages") ? "text-white" : "text-black"}
            size="xl"
          />
        </Pressable>
      </Box>

      <Box
        className={`flex-1 items-center justify-center h-full ${
          isActive("/profile") ? "bg-tertiary-400" : ""
        }`}
      >
        <Pressable
          onPress={() => router.push("/profile")}
          className="items-center justify-center h-full w-full"
        >
          <Avatar>
            <AvatarFallbackText>{profileName}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri:
                  profileImage ||
                  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
              }}
            />
            <AvatarBadge />
          </Avatar>
        </Pressable>
      </Box>
    </HStack>
  );
}
