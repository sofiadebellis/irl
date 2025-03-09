import React, { useEffect, useState } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { useRouter, Link } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const jsonData = await AsyncStorage.getItem("data");
      if (jsonData) {
        const data = JSON.parse(jsonData);
        const user = data.Users.find(
          (user: User) => user.email === email && user.password === password,
        );
        if (user) {
          await AsyncStorage.setItem("userID", user.id);
          router.push("/dashboard");
        } else {
          setError("Invalid email or password");
        }
      } else {
        setError("No users found");
      }
    } catch (error) {
      console.error("Error checking login credentials:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Center className="h-full bg-white p-10">
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
          onPress={handleLogin}
          variant="solid"
          size="xl"
          className="mt-4 w-full"
        >
          <ButtonText>Log In</ButtonText>
        </Button>

        <Text className="mt-4 text-center" size="xl">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-link-500 underline text-xl">
            Sign Up
          </Link>
        </Text>
      </VStack>
    </Center>
  );
}
