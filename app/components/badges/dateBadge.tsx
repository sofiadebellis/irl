import React from "react";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "@/components/ui/icon";

interface DateBadgeProps {
  date: string;
  available?: boolean;
}

export default function DateBadge({ date, available }: DateBadgeProps) {
  let dateIcon: React.ElementType;
  let colour: "success" | "info" | "error" | "muted" | undefined;

  if (available) {
    dateIcon = CheckCircleIcon;
    colour = "success";
  } else if (available === false) {
    dateIcon = AlertCircleIcon;
    colour = "error";
  } else {
    dateIcon = CalendarDaysIcon;
    colour = "info";
  }

  const dateOptions = {
    month: "short" as const,
    day: "2-digit" as const,
    hour: "numeric" as const,
    minute: "numeric" as const,
    hour12: true,
  };
  const formattedDate = new Date(date)
    .toLocaleString("en-US", dateOptions)
    .replace(" at", ",");

  return (
    <Badge size="lg" variant="solid" action={colour} className="self-start">
      <BadgeIcon as={dateIcon} />
      <BadgeText className="ml-2">{formattedDate}</BadgeText>
    </Badge>
  );
}
