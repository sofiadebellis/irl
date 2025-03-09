import React from "react";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Status } from "@/types";
import { statusIconMap } from "@/helpers";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let colour: "success" | "info" | "error" | "muted" | undefined;

  switch (status) {
    case Status.GOING:
      colour = "success";
      break;
    case Status.INTERESTED:
      colour = "info";
      break;
    case Status.CANT_GO:
      colour = "error";
      break;
    case Status.WENT:
      colour = "muted";
      break;
    default:
      return <></>;
  }

  return (
    <Badge size="lg" variant="solid" action={colour} className="self-start">
      <BadgeIcon as={statusIconMap[status]} />
      <BadgeText className="ml-2">{status}</BadgeText>
    </Badge>
  );
}
