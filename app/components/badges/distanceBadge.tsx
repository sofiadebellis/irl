import React from "react";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Distance } from "@/types";
import { distanceTextMap } from "@/helpers";

interface DistanceBadgeProps {
  distance: Distance;
}

export default function DistanceBadge({ distance }: DistanceBadgeProps) {
  return (
    <Badge size="lg" variant="solid" action="muted" className="self-start">
      <BadgeText>{distanceTextMap[distance]}</BadgeText>
    </Badge>
  );
}
