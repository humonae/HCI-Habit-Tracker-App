import { router, useFocusEffect } from "expo-router";
import { Text, View } from "react-native";
import * as SQLite from 'expo-sqlite';
import React, { useState } from "react";
import Habit from "@/components/Habit";
import ButtonWrapper from "@/components/ButtonWrapper";


export default function Index() {
  const [habits, setHabits] = useState<Array<any>>([]);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        try {
          const db = await SQLite.openDatabaseAsync('databaseName');
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS User (ID INTEGER PRIMARY KEY NOT NULL, Name TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS Habit (ID INTEGER PRIMARY KEY NOT NULL, Name TEXT NOT NULL, Frequency TEXT NOT NULL, GoodHabit INTEGER NOT NULL, AlertMe INTEGER NOT NULL, UserID INTEGER NOT NULL, FOREIGN KEY(UserID) REFERENCES User(ID));
            CREATE TABLE IF NOT EXISTS Alarms (ID INTEGER PRIMARY KEY NOT NULL, Day TEXT NOT NULL, Hour TEXT NOT NULL, Minute TEXT NOT NULL, Time TEXT NOT NULL, HabitID INTEGER NOT NULL, FOREIGN KEY(HabitID) REFERENCES Habit(ID));
          `);
          
          const habits: any = await db.getAllAsync('SELECT * FROM Habit');
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
    <View
      style={{
        padding: 24,
        flex: 1,
        rowGap: 24,
        width: "100%"
      }}
    >
      <Text style={{fontSize: 32}}>Home</Text>
      <View style={{display: "flex", rowGap: 12}}>
        <Text style={{fontSize: 20, fontWeight: "medium"}}>Your Habits</Text>
        <View
          style={{
            display: "flex",
            rowGap: 12
          }}
        >
          {habits.map((habit, i) => (
            <View key={i}>
              <Habit name={habit.Name}/>
            </View>
          ))}
        </View>
      </View>
      <ButtonWrapper onPress={() => router.navigate("/addHabit")} style={{width: "100%"}} title="Add Habit"/>
    </View>
  );
}
