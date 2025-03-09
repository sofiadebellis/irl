import React from "react";
import { Badge, BadgeText } from "@/components/ui/badge";
import { EventPrice } from "@/types";
import { priceTextMap } from "@/helpers";

interface PriceBadgeProps {
  eventPrice: EventPrice;
}

export default function EventPriceBadge({ eventPrice }: PriceBadgeProps) {
  return (
    <Badge size="lg" variant="solid" action="muted" className="self-start">
      <BadgeText>{priceTextMap[eventPrice]}</BadgeText>
    </Badge>
  );
}
