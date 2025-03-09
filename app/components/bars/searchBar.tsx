import React from "react";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

interface SearchBarProps {
  placeholder: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function SearchBar({
  placeholder,
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  return (
    <Input variant="rounded" size="xl" className="pl-7 bg-white">
      <InputSlot>
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </Input>
  );
}
