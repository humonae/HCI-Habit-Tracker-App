import React, { useEffect, useState } from "react";
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Modal } from "react-native";
import { Check, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CalendarDateProps {
    date: Date;
    habitID: number;
}

export default function CalendarDate(props: CalendarDateProps) {
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    // This can be done a lot better
    const [notes, setNotes] = useState([]);
    const [showNotes, setShowNotes] = useState(false);

    const [habits, setHabits] = useState([]);
    const [mappedHabits, setMappedHabits] = useState<any>({});

    useFocusEffect(
        React.useCallback(() => {
            const load = async () => {
                // DONT NEED TO DO ALL OF THIS
                // YOU CAN JUST SELECT THE HABITS ON THE DAY...
                // // ALSO LOAD NOTES
                // console.log("Running")
                // console.log("Habit ID: " + props.habitID);
                const db = await SQLite.openDatabaseAsync('databaseName');
                setDB(db);
                // const habits: any = await db.getAllAsync(`SELECT * FROM HabitHistory WHERE HabitID = ${props.habitID}`);
                // console.log("AB");
                // setHabits(habits);
                // console.log("B");
                // console.log("habits");
                // console.log(habits);

                // const mappedHabits: any = {};
                // for (const habit of habits) {
                //     // NEED TO CHECK
                //     const dateCompleted = new Date(habit["DateCompleted"]);
                //     const date = dateCompleted.getDate();
                //     const month = dateCompleted.getMonth();
                //     const year = dateCompleted.getUTCFullYear();

                //     if (!mappedHabits[year])
                //         mappedHabits[year] = {};
                //     if (!mappedHabits[year][month])
                //         mappedHabits[year][month] = [];
                //     mappedHabits[year][month][date].push(habit);
                // }
                // // setMappedHabits(mappedHabits);

                // // Date to Show
                // const date = props.date.getDate();
                // const month = props.date.getMonth();
                // const year = props.date.getUTCFullYear();
                // if (mappedHabits[year] && mappedHabits[year][month] && mappedHabits[year][month][date])
                //     setHabits(mappedHabits[year][month][date]);

                // LOAD JOURNALS
                // CREATE TABLE IF NOT EXISTS HabitJournal (ID INTEGER PRIMARY KEY NOT NULL, HabitID INTEGER NOT NULL, CreationDate DATETIME NOT NULL DEFAULT CURRENT_TIME, Content TEXT NOT NULL, FOREIGN KEY(HabitID) REFERENCES Habit(ID));
                try {
                    const dateLogged = props.date.toISOString().split('T')[0];
                    console.log("Date Logged: " + dateLogged);
                    let notes: any = await db.getAllAsync(`SELECT * FROM HabitJournal WHERE CreationDate = date('${dateLogged}')`); 
                    console.log("Notes 1:");
                    console.log(dateLogged, notes);
                    // notes = await db.getAllAsync(`SELECT * FROM HabitJournal`);
                    // console.log("Notes 2:");
                    // console.log(notes); 
                    setNotes(notes); 
                }
                catch (err) {
                    console.error(err);
                }
            }
            load();
        }, [])
    );

    return (
       <View>
             <Pressable
                onPress={() => setShowNotes(true)}
                style={{
                    backgroundColor: habits.length ? "green" : "red"
                }}
            >
                {habits.length ? <Check/> : <X/>}
                {!!notes.length && <Text>*</Text>}
                {showNotes &&
                    <Modal
                        animationType="slide"
                        visible={true}
                        presentationStyle="overFullScreen"
                        transparent={true}
                    >
                        <View
                            style={{
                                backgroundColor: "#000000A0",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                height: "100%"
                            }}
                        >
                            <SafeAreaView
                                style={{
                                    backgroundColor: "white",
                                    padding: 16
                                }}
                            >         
                                <Pressable
                                    onPress={() => setShowNotes(false)}
                                >
                                    <X/>
                                </Pressable>
                                {notes && notes.map(note => (
                                    <View>
                                        <Text>{JSON.stringify(note)}</Text>
                                    </View>
                                ))}
                            </SafeAreaView>
                        </View>
                    </Modal>
                }
            </Pressable>
       </View>
    )
}