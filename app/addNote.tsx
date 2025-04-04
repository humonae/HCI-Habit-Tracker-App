import React, { useState } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from 'expo-sqlite';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { BLUE, HORIZONTAL_PADDING, VERTICAL_PADDING } from "@/constants/design";
import Header from "@/components/basic/Header";
import TextArea from "@/components/TextArea";
import Button from "@/components/basic/Button";
import BackButton from "@/components/basic/BackButton";

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

    const goBack = async () => {
        router.back();
    }

    return (
        <GestureHandlerRootView style={{height: "100%", backgroundColor: "white"}}>
            {habit &&
                <SafeAreaView style={{padding: 16, paddingTop: 32, display: "flex", gap: VERTICAL_PADDING * 2}}
                >
                    {/* Back Button */}
                    <BackButton
                        onPress={goBack}
                    />
                    {/* Header */}
                    <View style={{display: "flex", gap: 4}}>
                        <View>
                            <Text style={{fontWeight: 400, color: "gray", fontSize: 20}}>Add Note</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", alignContent: "center", alignItems: "center", gap: 16}}>
                            <Header
                                title={"Habit Name"}
                                paragraph=""
                            />
                            <View style={{borderRadius: 9, backgroundColor: "#CfE4FF", paddingVertical: VERTICAL_PADDING * 0.5, padding: HORIZONTAL_PADDING * 0.5, borderWidth: 1, borderColor: BLUE}}>
                                <Text style={{fontSize: 18, fontWeight: 500, color: BLUE}}>{date.getMonth()+1}/{date.getDate()}</Text>
                            </View>
                        </View>
                    </View>
                    <KeyboardAvoidingView behavior={"padding"} style={{gap: 16}}>
                        {/* Area Note */}
                        <TextArea
                            value={note}
                            height={400}
                            placeholder="What are you thinking?"
                            onChangeText={(text: string) => setNote(text)}
                            error={null}
                        />
                        {/* Button */}
                        <Button 
                            label="Add Note"
                            onPress={addNote}
                            style={{
                                backgroundColor: BLUE
                            }}
                        />
                    </KeyboardAvoidingView>
                </SafeAreaView>
            }
        </GestureHandlerRootView>
    )
}