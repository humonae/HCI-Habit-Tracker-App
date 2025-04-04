import { router, useFocusEffect } from "expo-router";
import { Text, View, ScrollView } from "react-native";
import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState } from "react";
import Habit from "@/components/Habit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BLUE, HORIZONTAL_PADDING, VERTICAL_PADDING } from "@/constants/design";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/basic/Header";
import ButtonWrapper from "@/components/basic/ButtonWrapper";
import { Plus } from "lucide-react-native";
import { BUTTON_LABEL_STYLE } from "@/components/basic/Button";

export default function Dashboard() {
  const [userID, setUserID] = useState<number|null>();
  const [habits, setHabits] = useState<Array<any>>([]);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        try {
          // Fetch Stored User ID
          const storedUserID: string|null = await AsyncStorage.getItem('userID');
          if (!storedUserID) {
            router.replace("/");
            return;
          }

          const userID = parseInt(storedUserID);
          setUserID(userID);
          if (!userID)
            return;        

          const db = await SQLite.openDatabaseAsync('databaseName');
          const habits: any = await db.getAllAsync(`SELECT Habit.* FROM Habit JOIN User ON User.ID = Habit.UserID WHERE User.ID = ${userID}`);
          setHabits(habits);
        }
        catch (err) {
          console.error(err);
        }
      }
      load();
    }, [])
  );

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
        paddingVertical: VERTICAL_PADDING * 8,
        paddingHorizontal: HORIZONTAL_PADDING * 2,
        flex: 1,
        width: "100%"
      }}
    >
      <SafeAreaView style={{display: "flex", rowGap: 24}}>
        <View>
          <Header
            title="Your Habits"
            paragraph=""
          />
          {/* No Habits Message */}
          {!!!habits.length && 
            <Text style={{marginTop: 4, fontSize: 16, fontWeight: 400, color: "gray"}}>Looks like you don't have any habits! Click the button below to create a habit.</Text>
          }
        </View>
        {/* Habits */}
        <View style={{display: "flex", rowGap: 12}}>
          {habits.map((habit, i) => (
            <View key={i}>
              <Habit 
                id={habit.ID}
                name={habit.Name}
              />
            </View>
          ))}
        </View>
      </SafeAreaView>
      <ButtonWrapper 
        onPress={() => router.navigate("/addHabit")} 
        style={{width: "100%", gap: VERTICAL_PADDING, backgroundColor: "white", borderWidth: 1, borderColor: BLUE}}
      >
          <Plus color={BLUE}/>
          <Text style={{...BUTTON_LABEL_STYLE, color: BLUE, letterSpacing: 0.35}}>Add Habit</Text>
      </ButtonWrapper>
    </ScrollView>
  );
}
