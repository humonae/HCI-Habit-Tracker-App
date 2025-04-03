import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from "react-native";
import SignUp from "./signup";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [userID, setUserID] = useState<number|null>(null);
  
  useEffect(() => {
    const load = async () => {
      try {
        const value: string|null = await AsyncStorage.getItem('userID');
        console.log(`User ID: ${value}`);
        if (!value)
          return;
        setUserID(parseInt(value));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ headerShown: false }}/>
      <Stack.Screen name="addHabit" options={{title: "Add Habit"}}/>
    </Stack>
  );
}
