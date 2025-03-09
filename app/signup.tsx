import React, { useState } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { useRouter, Link } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validate = () => {
    if (!email) {
      setError("Please enter an email address.");
      return false;
    }

    if (!password) {
      setError("Please enter a password.");
      return false;
    }

    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    if (!regexp.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validate()) {
      return;
    }

    try {
      const jsonData = await AsyncStorage.getItem("data");
      const data = jsonData ? JSON.parse(jsonData) : { Users: [] };

      const existingUser = data.Users.find((user: any) => user.email === email);
      if (existingUser) {
        setError("Email already exists. Please use a different email.");
        return;
      }

      const newUser = {
        id: uuidv4(),
        email,
        password,
        name: "",
        bio: "",
        image: "",
        pronouns: "",
        university: "Other",
        availability: Array(7)
          .fill(null)
          .map(() => Array(24).fill(false)),
        eventNotifications: true,
        messageNotifications: false,
        location: "",
        privateAccount: false,
        chats: [],
        events: [],
        friends: [],
        interest: [],
      };

      const updatedData = {
        ...data,
        Users: [...data.Users, newUser],
      };

      await AsyncStorage.setItem("data", JSON.stringify(updatedData));
      await AsyncStorage.setItem("userID", newUser.id);

      router.push("/create-profile");
    } catch (error) {
      console.error("Error during signup:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Center className="flex-1 bg-white p-10">
      <VStack space="4xl" className="align-items-center w-full">
        <Heading text-typography-950 size="4xl" className="text-center">
          IRL
        </Heading>

        <VStack className="w-full mt-4">
          <Text size="xl">Email</Text>
          <Input variant="outline" size="xl" isRequired={true}>
            <InputField
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
            />
          </Input>
        </VStack>

        <VStack className="w-full mt-4">
          <Text size="xl">Password</Text>
          <Input variant="outline" size="xl" isRequired={true}>
            <InputField
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <InputSlot
              className="pr-2"
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Icon as={isPasswordVisible ? EyeOffIcon : EyeIcon} size="xl" />
            </InputSlot>
          </Input>
        </VStack>

        {error ? (
          <Text size="xl" className="text-red-500 mt-2">
            {error}
          </Text>
        ) : null}

        <Button
          onPress={handleSignup}
          variant="solid"
          size="xl"
          className="mt-4 w-full"
        >
          <ButtonText>Sign Up</ButtonText>
        </Button>
        <Text className="mt-4 text-center" size="xl">
          Already have an account?{" "}
          <Link href="/login" className="text-link-500 underline text-xl">
            Log in
          </Link>
        </Text>
      </VStack>
    </Center>
  );
}
