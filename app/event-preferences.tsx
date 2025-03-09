import React, { useState, useEffect } from "react";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { Fab, FabIcon } from "@/components/ui/fab";
import ProgressBar from "./components/progress-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventCategory } from "@/types";
import { categoryIconMap } from "@/helpers";

import {
  Volleyball,
  TentTree,
  Pizza,
  Earth,
  PaintRoller,
  HeartHandshake,
  GraduationCap,
} from "lucide-react-native";

type Preference = {
  category: EventCategory;
  text: string;
  selected: boolean;
};

export default function SetEventPreferences() {
  const [preferences, setPreferences] = useState<Preference[]>([
    {
      category: EventCategory.ENTERTAINMENT,
      text: "Entertainment",
      selected: false,
    },
    {
      category: EventCategory.CREATIVE,
      text: "Diy and Crafts",
      selected: false,
    },
    {
      category: EventCategory.FOOD_RELATED,
      text: "Food and Drink",
      selected: false,
    },
    {
      category: EventCategory.FITNESS,
      text: "Sport and Fitness",
      selected: false,
    },
    {
      category: EventCategory.PUZZLES,
      text: "Board Games and Puzzles",
      selected: false,
    },
    {
      category: EventCategory.TRAVEL,
      text: "Travel and Exploration",
      selected: false,
    },
    {
      category: EventCategory.CHARITY,
      text: "Charity and Volunteering",
      selected: false,
    },
  ]);

  const handleSelection = (text: string) => {
    setPreferences((prevPreferences) =>
      prevPreferences.map((pref) =>
        pref.text === text ? { ...pref, selected: !pref.selected } : pref,
      ),
    );
  };

  const savePreferences = async () => {
    try {
      const userID = await AsyncStorage.getItem("userID");

      if (!userID) {
        console.error("No userID found in Async Storage.");
      }
      const jsonData = await AsyncStorage.getItem("data");
      const data = jsonData ? JSON.parse(jsonData) : { Users: [] };

      const interests = preferences
        .filter((p) => p.selected === true)
        .map((p) => p.category);

      const updatedUsers = data.Users.map((user: any) =>
        user.id === userID
          ? {
              ...user,
              interest: interests,
            }
          : user,
      );

      const updatedData = { ...data, Users: updatedUsers };
      await AsyncStorage.setItem("data", JSON.stringify(updatedData));

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  return (
    <Box className="h-full bg-white grow">
      <ProgressBar stepNumber={4} />
      <Fab
        placement="top left"
        size="lg"
        onPress={() => router.back()}
        className="border border-black bg-transparent p-2 mt-4 active:bg-transparent focus:bg-transparent"
      >
        <FabIcon
          as={ArrowLeftIcon}
          onPress={() => router.back()}
          className="text-black"
        />
      </Fab>
      <Center className="flex-1 bg-white p-10 mt-1">
        <VStack space="sm" className="w-full">
          <Heading size="3xl" className="text-left">
            Event Preferences
          </Heading>
          <Text className="text-lg">
            Select types of events you would like to attend
          </Text>
          <Grid
            className="gap-4"
            _extra={{
              className: "grid-cols-2",
            }}
          >
            {preferences.map((p) => (
              <GridItem
                _extra={{
                  className: "col-span-1",
                }}
                key={p.text}
                className={`h-[100px] rounded-lg border-2 flex ${
                  p.selected ? "border-tertiary-400" : "border-black"
                }`}
              >
                <Pressable
                  onPress={() => handleSelection(p.text)}
                  className="flex flex-1 justify-around items-center p-2"
                >
                  <Icon
                    as={categoryIconMap[p.category]}
                    className={p.selected ? "text-tertiary-400" : "text-black"}
                    size="xl"
                  />
                  <Text
                    className={`text-lg text-center font-semibold ${
                      p.selected ? "text-tertiary-400" : "text-black"
                    }`}
                  >
                    {p.category}
                  </Text>
                </Pressable>
              </GridItem>
            ))}
          </Grid>
          <VStack space="lg" className="w-full mt-5">
            <Button variant="solid" size="xl" onPress={savePreferences}>
              <ButtonText>Done</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
}
