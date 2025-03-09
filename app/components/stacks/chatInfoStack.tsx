import React from "react";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import {
  AlertCircleIcon,
  ExternalLinkIcon,
} from "lucide-react-native";
import { SlashIcon, Icon } from "@/components/ui/icon";

export default function ChatInfoStack() {
  return (
    <Box>
      <Text className="text-xl font-medium mb-2">Privacy and Support</Text>
      {[
        { label: "Block", icon: SlashIcon },
        { label: "Report", icon: AlertCircleIcon },
        { label: "Share contact", icon: ExternalLinkIcon },
      ].map((block, idx) => {
        return (
          <Box
            key={block.label}
            className={`flex flex-row items-center gap-2 bg-[#F2F2F1] p-4 ${
              (idx === 0 && `rounded-tr-md rounded-tl-md`) ||
              (idx === 2 && `rounded bl-md rounded-br-md`)
            } ${idx !== 2 && `border-b-2 border-[#B3B3B3]`}`}
          >
            <Icon
              as={block.icon}
              width={25}
              height={25}
              color="#525252"
              fill="none"
            ></Icon>
            <Text className="text-lg font-medium">{block.label}</Text>
          </Box>
        );
      })}
    </Box>
  );
}
