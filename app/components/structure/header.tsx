import React from "react";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";

export default function Header() {
  return (
    <HStack className="w-full h-16 bg-black items-center px-4" >
      <Heading className='text-typography-0' size={"3xl"}>
        IRL
      </Heading>
    </HStack>
  );
}
