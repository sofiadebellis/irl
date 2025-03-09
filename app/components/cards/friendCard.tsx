import React from "react";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";

interface FriendCardProps {
  id: string;
  username: string;
  image: string;
  mutualFriends: number;
}

export default function FriendCard({
  id,
  username,
  image,
  mutualFriends,
}: FriendCardProps) {
  return (
    <HStack className="w-full items-center py-4 bg-white" space="sm">
      <Avatar size="xl" className="mr-5">
        <AvatarImage
          source={{
            uri:
              image ||
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
          }}
        />
      </Avatar>

      <VStack className="flex-1">
        <Heading size="xl">{username}</Heading>
        <Text size="md">{mutualFriends} Mutual Friends</Text>
      </VStack>
    </HStack>
  );
}
