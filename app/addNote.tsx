import React, { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from 'expo-sqlite';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

export default function AddNote() {
    const router = useRouter();
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    const [habit, setHabit] = useState<any>();
    const { habitID } = useLocalSearchParams();
    const [date, setDate] = useState(new Date());
    const [note, setNote] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            const load = async () => {
                console.log(habitID);
                const db = await SQLite.openDatabaseAsync('databaseName');
                setDB(db);

                const habit = await db.getFirstAsync(`SELECT * FROM Habit WHERE ID = ${habitID}`);
                setHabit(habit);
                console.log(habit);
            }
            load();
        }, [])
    );

    const addNote = async () => {
        if (!db)
            return;
        await db.execAsync(`INSERT INTO HabitJournal (HabitID, Content) VALUES (${habitID}, '${note}');`);
        router.back();
    }

    return (
        <GestureHandlerRootView>
            {habit &&
                <SafeAreaView
                    style={{
                        padding: 16
                    }}
                >
                    <Text>{habit.Name}</Text>
                    <Text>{date.getMonth()+1}/{date.getDate()}</Text>
                    <TextInput
                        placeholder="What are you thinking?"
                        style={{
                            borderWidth: 1,
                            borderColor: "black",
                            height: 200,
                            textAlignVertical: 'top'
                        }}
                        multiline={true}
                        numberOfLines={10}
                        onChangeText={(text: string) => setNote(text)}
                    />
                    <Pressable
                        style={{
                            backgroundColor: "red",
                            padding: 16
                        }}
                        onPress={addNote}
                    >
                        <Text>Add Note</Text>
                    </Pressable>
                </SafeAreaView>
            }
        </GestureHandlerRootView>
    )
}