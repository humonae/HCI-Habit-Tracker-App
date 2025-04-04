import React, { useEffect, useState } from "react";
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Modal } from "react-native";
import { Asterisk, Check, Circle, MessageCircleDashed, Wind, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BORDER_COLOR, BORDER_RADIUS, BOX_SHADOW, BOX_SHADOW_MD, GREEN_1, GREEN_2, RED_1, RED_2 } from "@/constants/design";
import BackButton from "./basic/BackButton";

interface CalendarDateProps {
    date: Date;
    habitID: number;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Got this off the Internet, who has time to think about these things?
function getOrdinal(n: number) {
    let ord = 'th';
    if (n % 10 == 1 && n % 100 != 11)
        ord = 'st';
    else if (n % 10 == 2 && n % 100 != 12)
        ord = 'nd';
    else if (n % 10 == 3 && n % 100 != 13)
        ord = 'rd';
    return ord;
}

export default function CalendarDate(props: CalendarDateProps) {
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    const [notes, setNotes] = useState([]);
    const [showNotes, setShowNotes] = useState(false);
    const [habits, setHabits] = useState([]); 

    useFocusEffect(
        React.useCallback(() => {
            const load = async () => {
                const db = await SQLite.openDatabaseAsync('databaseName');
                setDB(db);
                
                try {
                    const dateLogged = props.date.toISOString().split('T')[0];
                    const habits: any = await db.getAllAsync(`SELECT * FROM HabitHistory WHERE HabitID = ${props.habitID} AND DateCompleted = date('${dateLogged}')`);
                    console.log(habits);
                    setHabits(habits);

                    let notes: any = await db.getAllAsync(`SELECT * FROM HabitJournal WHERE CreationDate = date('${dateLogged}')`); 
                    console.log(notes);
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
       <View style={{margin: 4, display: "flex", alignItems: "center", justifyContent: "center"}}>
             <Pressable
                onPress={() => setShowNotes(true)}
                style={{
                    borderRadius: BORDER_RADIUS,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center",
                    borderWidth: 1,
                    // borderStyle: "dashed",
                    borderColor: !!habits.length ? GREEN_2 : RED_2,
                    backgroundColor: !!habits.length ? GREEN_1 : RED_1
                }}
            >
                {!!habits.length ? <Check color="#38b042" strokeWidth={2.5}/> : <X color="red" strokeWidth={2.5}/>}
                {!!notes.length &&
                    <View style={{position: "absolute", top: -2, right: -2}}>
                        <Circle size={10} color={!!habits.length ? GREEN_2 : RED_2} fill={!!habits.length ? GREEN_2 : RED_2}/>
                    </View>
                }
                {showNotes &&
                    <Modal
                        // The background slides in as well,
                        // it doesn't look nice.
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
                                    padding: 16,
                                    height: "75%"
                                }}
                            >
                                <BackButton onPress={() => setShowNotes(false)}/>
                                <View style={{marginBottom: 24}}>
                                    <Text style={{fontSize: 24, fontWeight: 500}}>Your Notes on {monthNames[props.date.getMonth()]} {props.date.getDate() + getOrdinal(props.date.getDate())}</Text>
                                </View>
                                <View style={{gap: 16}}>
                                    {notes.map((note, i) => (
                                        <View key={i} style={{borderWidth: 1, borderColor: BORDER_COLOR, padding: 8, borderRadius: BORDER_RADIUS, boxShadow: BOX_SHADOW_MD}}>
                                            <Text>{note["Content"]}</Text>
                                        </View>
                                    ))}
                                    {!notes.length &&
                                        <View style={{width: "100%", gap: 16, height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                            <MessageCircleDashed strokeWidth={1.5} size={64} color="gray"/>
                                            <Text style={{textAlign: "center", fontSize: 24, color: "gray"}}>No Notes</Text>
                                        </View>
                                    }
                                </View>
                            </SafeAreaView>
                        </View>
                    </Modal>
                }
            </Pressable>
       </View>
    )
}