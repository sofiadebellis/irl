import React from "react";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ImageBackground } from "@/components/ui/image-background";
import { ScrollView } from "react-native";

interface ChatCardProps {
  name: string;
  coverPhoto: string;
  lastAuthor: string | undefined;
  lastMessage: string | undefined;
}

export default function ChatCard({
  name,
  coverPhoto,
  lastAuthor,
  lastMessage,
}: ChatCardProps) {
  return (
    <Card
      variant="outline"
      className="p-0 bg-white w-full border-[#DEDEDE]"
      style={{ borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}
    >
      <HStack space="xs" className="w-full">
        <ImageBackground
          source={{
            uri: coverPhoto,
          }}
          resizeMode="cover"
          className="w-24 h-24"
          imageStyle={{ borderRadius: 50 }}
        />
        <VStack space="sm" className="p-3 flex-1">
          <Heading size="lg" className="break-words" numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Heading>
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
          > */}
            <HStack space="sm">
              <Text numberOfLines={1} ellipsizeMode="tail" className="w-64">
                {lastMessage
                  ? `${lastAuthor ? lastAuthor : "Unknown"}: ${lastMessage}`
                  : "No messages yet"}
              </Text>
            </HStack>
          {/* </ScrollView> */}
        </VStack>
      </HStack>
    </Card>
  );
}
