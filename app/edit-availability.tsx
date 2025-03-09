import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { router } from "expo-router";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { Fab, FabIcon } from "@/components/ui/fab";
import ProgressBar from "./components/progress-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditAvailabilities() {
  const createEmptyGrid = () => {
    return Array(7)
      .fill(null)
      .map(() => Array(24).fill(false));
  };
  const [availability, setAvailability] = useState<boolean[][]>(
    createEmptyGrid(),
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAvailabilities = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        if (userID) {
          const jsonData = await AsyncStorage.getItem("data");
          const data = jsonData ? JSON.parse(jsonData) : { Users: [] };
          const user = data.Users.find((user: any) => user.id === userID);

          if (user) {
            setAvailability(user.availability || createEmptyGrid());
          }
          setLoading(false);
        } else {
          console.error("No userID found in Async Storage.");
        }
      } catch (error) {
        console.error("Error loading availabilities:", error);
      }
    };

    loadAvailabilities();
  }, []);

  const saveAvailabilities = async () => {
    try {
      const userID = await AsyncStorage.getItem("userID");
      const jsonData = await AsyncStorage.getItem("data");
      const data = jsonData ? JSON.parse(jsonData) : { Users: [] };

      const updatedUsers = data.Users.map((user: any) =>
        user.id === userID
          ? {
              ...user,
              availability,
            }
          : user,
      );

      const updatedData = { ...data, Users: updatedUsers };
      await AsyncStorage.setItem("data", JSON.stringify(updatedData));

      router.push("/profile");
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const hours = [
    "12am",
    "1am",
    "2am",
    "3am",
    "4am",
    "5am",
    "6am",
    "7am",
    "8am",
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
    "8pm",
    "9pm",
    "10pm",
    "11pm",
  ];

  const handleCellPress = (row: number, col: number) => {
    const updatedGrid = [...availability];
    updatedGrid[row][col] = !updatedGrid[row][col];

    setAvailability(updatedGrid);
  };

  return (
    <Box className="h-full bg-white">
      <Box>
        <Fab
          placement="top left"
          size="lg"
          onPress={() => router.back()}
          className="border border-black bg-white p-2 mt-5 active:bg-white focus:bg-white"
          style={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: "white",
            height: 50,
            width: 50,
          }}
        >
          <FabIcon
            as={ArrowLeftIcon}
            onPress={() => router.back()}
            size="xl"
            className="text-black"
          />
        </Fab>
        <Box className="w-full mt-10">
          <Box className="ml-10 mr-10">
            <Heading size="3xl" className="text-left ml-10 mt-2">
              Set Availabilities
            </Heading>
            <Text size="md" className="mt-5">
              <Text size="md" style={{ fontWeight: "bold" }}>
                Tap
              </Text>{" "}
              on the cells to fill out your availabilities.{" "}
              <Text size="md" style={{ fontWeight: "bold" }}>
                Scroll
              </Text>{" "}
              to view more times and{" "}
              <Text size="md" style={{ fontWeight: "bold" }}>
                swipe
              </Text>{" "}
              to view more days.
            </Text>
            <Box className="flex flex-row gap-2 mt-2 justify-start items-center">
              <Box className="border border-black h-5 w-20 bg-success-200"></Box>
              <Text>Available</Text>
            </Box>
          </Box>
        </Box>
        <Box className="h-[60vh] mt-2 mb-10 px-2 flex flex-column gap-1 space-between gap-5">
          <ScrollView className="flex-1 flex-column">
            <Box className="flex flex-row gap-1">
              <Box className="flex flex-column mt-2">
                {hours.map((h, i) => {
                  return (
                    <Box className={`h-[50px]`} key={i}>
                      <Text>{h}</Text>
                    </Box>
                  );
                })}
              </Box>
              <ScrollView horizontal>
                <Box>
                  <Box className="flex-row">
                    {days.map((day, i) => {
                      return (
                        <Box key={i} className="w-[140px]">
                          <Text className="text-center">{day}</Text>
                        </Box>
                      );
                    })}
                  </Box>
                  <Box className="flex flex-row">
                    {availability.map((row, rowIndex) => (
                      <Box key={rowIndex} className="mb-1">
                        {row.map((cell, colIndex) => (
                          <TouchableOpacity
                            key={`${rowIndex}-${colIndex}`}
                            onPress={() => {
                              handleCellPress(rowIndex, colIndex);
                            }}
                          >
                            <Box
                              key={colIndex}
                              className={`flex items-center justify-center border border-gray-300 w-[140px] h-[50px] ${
                                availability[rowIndex][colIndex]
                                  ? "bg-success-200"
                                  : "bg-gray-100"
                              }`}
                            ></Box>
                          </TouchableOpacity>
                        ))}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </ScrollView>
            </Box>
          </ScrollView>
          <Center className="bg-white px-10">
            <Button
              variant="solid"
              size="xl"
              onPress={saveAvailabilities}
              className="w-[100%]"
            >
              <ButtonText>Save</ButtonText>
            </Button>
          </Center>
        </Box>
      </Box>
    </Box>
  );
}
