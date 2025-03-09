import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonText,
} from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  categoryIconMap,
  distanceTextMap,
  priceLabelMap,
  priceTextMap,
} from "@/helpers";
import { Distance, EventCategory, EventPrice, Filters } from "@/types";
import { FilterIcon } from "lucide-react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FilterButtonProps {
  updateFilters: (value: Filters) => void;
  disableDistance: boolean;
}

export default function FilterButton({
  updateFilters,
  disableDistance,
}: FilterButtonProps) {
  const toEnumArray = (type: object) => {
    return Object.keys(type).map((key) => type[key as keyof typeof type]);
  };
  const initFilters: Filters = {
    availability: false,
    cantGo: false,
    category: toEnumArray(EventCategory),
    distance: toEnumArray(Distance),
    price: toEnumArray(EventPrice),
  };

  const [filters, setFilters] = useState(initFilters);
  const [showActionsheet, setShowActionsheet] = useState(false);

  const handleClose = () => setShowActionsheet(false);

  const toggleAvailability = () => {
    const tempFilters = { ...filters };
    tempFilters["availability"] = !tempFilters["availability"];
    setFilters(tempFilters);
  };

  const toggleCantGo = () => {
    const tempFilters = { ...filters };
    tempFilters["cantGo"] = !tempFilters["cantGo"];
    setFilters(tempFilters);
  };

  const selectCategory = (category: EventCategory) => {
    const tempFilters = { ...filters };
    if (tempFilters["category"].includes(category)) {
      tempFilters["category"] = tempFilters["category"].filter(
        (c) => c !== category,
      );
    } else {
      tempFilters["category"] = [...tempFilters["category"], category];
    }
    setFilters(tempFilters);
  };

  const selectDistance = (distance: Distance) => {
    const tempFilters = { ...filters };

    const distances = Object.values(Distance);
    const index = distances.indexOf(distance);

    const newDistances = distances.slice(0, index + 1);

    if (distance === Distance.OVER_FIFTY) {
      if (tempFilters["distance"].includes(distance)) {
        tempFilters["distance"] = tempFilters["distance"].filter(
          (d) => d !== distance,
        );
      } else {
        tempFilters["distance"] = [...tempFilters["distance"], distance];
      }
    } else if (distance === Distance.ONE) {
      if (tempFilters["distance"].includes(Distance.FIVE)) {
        if (tempFilters["distance"].includes(Distance.OVER_FIFTY)) {
          tempFilters["distance"] = [...newDistances, Distance.OVER_FIFTY];
        } else {
          tempFilters["distance"] = newDistances;
        }
      } else if (tempFilters["distance"].includes(Distance.ONE)) {
        if (tempFilters["distance"].includes(Distance.OVER_FIFTY)) {
          tempFilters["distance"] = [Distance.OVER_FIFTY];
        } else {
          tempFilters["distance"] = [];
        }
      } else if (!tempFilters["distance"].includes(Distance.ONE)) {
        if (tempFilters["distance"].includes(Distance.OVER_FIFTY)) {
          tempFilters["distance"] = [Distance.ONE, Distance.OVER_FIFTY];
        } else {
          tempFilters["distance"] = [Distance.ONE];
        }
      }
    } else if (tempFilters["distance"].includes(Distance.OVER_FIFTY)) {
      tempFilters["distance"] = [...newDistances, Distance.OVER_FIFTY];
    } else {
      tempFilters["distance"] = newDistances;
    }

    setFilters(tempFilters);
  };

  const selectPrice = (price: EventPrice) => {
    const tempFilters = { ...filters };
    if (tempFilters["price"].includes(price)) {
      tempFilters["price"] = tempFilters["price"].filter((p) => p !== price);
    } else {
      tempFilters["price"] = [...tempFilters["price"], price];
    }
    setFilters(tempFilters);
  };

  const applyFilters = async () => {
    await AsyncStorage.setItem("filters", JSON.stringify(filters));
    updateFilters(filters);
    handleClose();
  };

  return (
    <>
      <Button
        onPress={() => setShowActionsheet(true)}
        size="lg"
        className="flex-2"
      >
        <ButtonIcon as={FilterIcon} />
        <ButtonText className="ml-2">Filter</ButtonText>
      </Button>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack space="lg" className="w-full mt-3">
            <Heading size="lg" className="font-semibold">
              Filter Events
            </Heading>
            <Divider />

            <HStack className="justify-between items-center">
              <Text size="lg">Only When I'm Available</Text>
              <Switch
                value={filters["availability"]}
                onToggle={toggleAvailability}
                trackColor={{ true: "#fb9d4b" }}
              />
            </HStack>
            <HStack className="justify-between items-center">
              <Text size="lg">Hide 'Can't Go' Events</Text>
              <Switch
                value={filters["cantGo"]}
                onToggle={toggleCantGo}
                trackColor={{ true: "#fb9d4b" }}
              />
            </HStack>
            <VStack space="md">
              <Text size="lg">Category</Text>
              <ButtonGroup className="flex-wrap">
                {Object.keys(EventCategory).map((key, index) => {
                  const category =
                    EventCategory[key as keyof typeof EventCategory];
                  return (
                    <Button
                      key={index}
                      variant={
                        filters["category"].includes(category)
                          ? "solid"
                          : "outline"
                      }
                      onPress={() => selectCategory(category)}
                    >
                      <ButtonIcon as={categoryIconMap[category]} />
                      <ButtonText>{category}</ButtonText>
                    </Button>
                  );
                })}
              </ButtonGroup>
            </VStack>
            {!disableDistance && (
              <VStack space="md">
                <Text size="lg">Distance</Text>
                <ButtonGroup className="flex-wrap">
                  {Object.keys(Distance).map((key, index) => {
                    const distance = Distance[key as keyof typeof Distance];
                    return (
                      <Button
                        key={index}
                        variant={
                          filters["distance"].includes(distance)
                            ? "solid"
                            : "outline"
                        }
                        onPress={() => selectDistance(distance)}
                      >
                        <ButtonText>{distanceTextMap[distance]}</ButtonText>
                      </Button>
                    );
                  })}
                </ButtonGroup>
              </VStack>
            )}
            <VStack space="md">
              <Text size="lg">Price</Text>
              <ButtonGroup className="flex-wrap">
                {Object.keys(EventPrice).map((key, index) => {
                  const price = EventPrice[key as keyof typeof EventPrice];
                  return (
                    <VStack key={index} className="items-center">
                      <Button
                        variant={
                          filters["price"].includes(price) ? "solid" : "outline"
                        }
                        onPress={() => selectPrice(price)}
                      >
                        <ButtonText>{priceTextMap[price]}</ButtonText>
                      </Button>
                      {price !== EventPrice.FREE && (
                        <Text size="sm">{priceLabelMap[price]}</Text>
                      )}
                    </VStack>
                  );
                })}
              </ButtonGroup>
            </VStack>

            <Divider />
            <ButtonGroup className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onPress={() => setFilters(initFilters)}
              >
                <ButtonText>Reset</ButtonText>
              </Button>
              <Button size="lg" className="flex-1" onPress={applyFilters}>
                <ButtonIcon as={FilterIcon} />
                <ButtonText className="ml-2">Apply filters</ButtonText>
              </Button>
            </ButtonGroup>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
