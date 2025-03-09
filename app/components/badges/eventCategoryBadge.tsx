import React from "react";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { EventCategory } from "@/types";
import { categoryIconMap } from "@/helpers";

interface EventCategoryBadgeProps {
  eventCategory: EventCategory;
}

export default function EventCategoryBadge({
  eventCategory,
}: EventCategoryBadgeProps) {
  return (
    <Badge size="lg" variant="solid" action="muted" className="self-start">
      <BadgeIcon as={categoryIconMap[eventCategory]} />
      <BadgeText className="ml-2">{eventCategory}</BadgeText>
    </Badge>
  );
}
