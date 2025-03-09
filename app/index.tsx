import React, { useEffect } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { useRouter } from 'expo-router';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import data from '../data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    const storeData = async () => {

      await AsyncStorage.clear();
      try {
        const existingData = await AsyncStorage.getItem("data");
        if (!existingData) {
          await AsyncStorage.setItem("data", JSON.stringify(data));
        } 
      } catch (error) {
        console.error("Error accessing AsyncStorage:", error);
      }
    };

    storeData();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Center className='flex-1 bg-white'>
        <VStack className='w-full p-10 bg-secondary-0' space='4xl'>
          <Heading text-typography-950 size={'4xl'} className='text-center'>
            IRL
          </Heading>
          <Button
            onPress={() => router.push('/login')}
            variant='solid'
            size='xl'
          >
            <ButtonText>Log in</ButtonText>
          </Button>
          <Button
            onPress={() => router.push('/signup')}
            variant='outline'
            size='xl'
          >
            <ButtonText>Sign Up</ButtonText>
          </Button>
        </VStack>
      </Center>
    </GestureHandlerRootView>
  );
}
