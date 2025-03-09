import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

interface DashboardCardProps {
  heading: string;
  number: number;
}

export default function DashboardCard({ heading, number }: DashboardCardProps) {
  return (
    <HStack className="flex-1">
      <Box className="bg-tertiary-400 w-2 h-full" />
      <Card
        size="md"
        variant="filled"
        className="p-3 bg-background-100 w-full justify-between"
      >
        <Heading size="lg" numberOfLines={2} isTruncated className="mb-1">
          {heading}
        </Heading>
        <Text size="4xl" bold>
          {number}
        </Text>
      </Card>
    </HStack>
  );
}
