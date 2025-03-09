import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select";
import { Sort } from "@/types";
import { ChevronDownIcon } from "lucide-react-native";

interface SortButtonProps {
  updateSort: (value: Sort) => void;
}

export default function SortButton({ updateSort }: SortButtonProps) {
  return (
    <Select
      className="flex-1 bg-white"
      initialLabel="Sort events"
      defaultValue={Sort.DATE}
      onValueChange={(value) => {
        const sort = Sort[value as keyof typeof Sort];
        updateSort(sort);
      }}
    >
      <SelectTrigger variant="outline" size="lg">
        <SelectInput />
        <SelectIcon as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <SelectItem label="Date" value={Sort.DATE} />
          <SelectItem label="Distance, ascending" value={Sort.DISTANCE_ASC} />
          <SelectItem label="Distance, descending" value={Sort.DISTANCE_DES} />
          <SelectItem label="Price, ascending" value={Sort.PRICE_ASC} />
          <SelectItem label="Price, descending" value={Sort.PRICE_DES} />
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
