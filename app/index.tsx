import { router, useFocusEffect } from "expo-router";
import { Text, View, ScrollView } from "react-native";
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
            CREATE TABLE IF NOT EXISTS User (ID INTEGER PRIMARY KEY NOT NULL, FName TEXT NOT NULL, LName TEXT NOT NULL, Email TEXT NOT NULL, Password TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS Frequency (ID INTEGER PRIMARY KEY NOT NULL, Type TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS Habit (ID INTEGER PRIMARY KEY NOT NULL, UserID INTEGER NOT NULL, Frequency TEXT NOT NULL, Name TEXT NOT NULL, Good INTEGER NOT NULL, Alert INTEGER NOT NULL, FOREIGN KEY(UserID) REFERENCES User(ID));
            CREATE TABLE IF NOT EXISTS HabitJournal (ID INTEGER PRIMARY KEY NOT NULL, HabitID INTEGER NOT NULL, CreationDate DATETIME NOT NULL DEFAULT CURRENT_TIME, Content TEXT NOT NULL, FOREIGN KEY(HabitID) REFERENCES Habit(ID));
            CREATE TABLE IF NOT EXISTS HabitHistory (ID INTEGER PRIMARY KEY NOT NULL, HabitID INTEGER NOT NULL, DateCompleted DATE NOT NULL DEFAULT CURRENT_DATE, FOREIGN KEY(HabitID) REFERENCES Habit(ID));
            CREATE TABLE IF NOT EXISTS HabitAlarms (ID INTEGER PRIMARY KEY NOT NULL, HabitID INTEGER NOT NULL, Alarm DATETIME NOT NULL, FOREIGN KEY(HabitID) REFERENCES Habit(ID));
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
    <ScrollView
      style={{
        padding: 24,
        flex: 1,
        rowGap: 24,
        width: "100%"
      }}
    >
      <View style={{display: "flex", rowGap: 12}}>
        <Text style={{fontSize: 25, fontWeight: "bold"}}>Your Habits</Text>
        <View
          style={{
            display: "flex",
            rowGap: 12
          }}
        >
          {habits.map((habit, i) => (
            <View key={i}>
              <Habit name={habit.Name} id={habit.ID} good={habit.Good}/>
            </View>
          ))}
        </View>
      </View>
      <ButtonWrapper onPress={() => router.navigate("/addHabit")} style={{width: "100%", marginTop: 20, marginBottom: 100}} title="Add Habit"/>
    </ScrollView>
  );
}
