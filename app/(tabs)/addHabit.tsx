import ButtonGroup from "@/components/ButtonGroup";
import Checkbox from "@/components/Checkbox";
import DateTimePicker, { DateTime } from "@/components/DateTimePicker";
import Toggle from "@/components/Toggle";
import { Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import * as SQLite from 'expo-sqlite';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';
import { BLUE, HORIZONTAL_PADDING, VERTICAL_PADDING } from "@/constants/design";
import TextField from "@/components/TextField";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import Header from "@/components/basic/Header";
import { Field } from "@/components/Field";
import Button from "@/components/basic/Button";

export default function AddHabit() {
    const [userID, setUserID] = useState<number>();
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();

    // Habit Information
    const [name, setName] = useState<Field>(["", null]);
    const [frequency, setFrequency] = useState("Daily");
    const [good, setGood] = useState(true);
    const [alert, setAlert] = useState(false);
    const [alertDates, setAlertDates] = useState<Array<DateTime>>([]);
    const [editAlertDateID, setEditAlertDateID] = useState(0);

    useFocusEffect(React.useCallback(() => {
        setName(["", null]);
        setFrequency("Daily");
        setGood(true);
        setAlert(false);
        setAlertDates([]);
        setEditAlertDateID(0);
    }, []))

    useEffect(() => {
        const load = async () => {
            try {              
                const storedUserID: string|null = await AsyncStorage.getItem('userID');
                if (!storedUserID)
                    return;
                const userID = parseInt(storedUserID);
                setUserID(userID);

                const db = await SQLite.openDatabaseAsync('databaseName');
                setDB(db);
            }
            catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    const updateName = (name: string) => {
        let error = "";
        if (name.length < 5)
            error += "Name must be at least 5 characters."
        setName([name, error]);
        return !!error;
    }

    const saveHabit = async () => {
        if (!db)
            return;

        try {
            
            const result = await db.runAsync(`INSERT INTO Habit (Name, Frequency, Good, Alert, UserID) VALUES ('${name[0]}', '${frequency}', ${good ? 1 : 0}, ${alert ? 1 : 0}, ${userID});`);
            const habitID = result.lastInsertRowId;

            for (const alertDate of alertDates) {
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const date = new Date();
                date.setDate(days.indexOf(alertDate.day));
                date.setHours(parseInt(alertDate.hour));
                date.setMinutes(parseInt(alertDate.minute));
                const dateString = date.toISOString().split('T')[0];
                await db.execAsync(`INSERT INTO HabitAlarms (HabitID, Alarm) VALUES (${habitID}, '${dateString}');`);
            }
            router.back();
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <GestureHandlerRootView style={{rowGap: 0, paddingVertical: VERTICAL_PADDING * 8, paddingHorizontal: HORIZONTAL_PADDING * 2, gap: 32, backgroundColor: "white", height: "100%"}}>
            <ScrollView>
                <View style={{paddingTop: 48, marginBottom: 16}}>
                    <Header
                        title="Add New Habit"
                        paragraph=""
                    />
                </View>
                <View
                    style={{
                        paddingTop: 0,
                        display: "flex",
                        rowGap: 24
                    }}
                >
                    <View style={{rowGap: 4}}>
                        <Text style={{fontSize: 16, fontWeight: "500"}}>Habit Name</Text>
                        <TextField
                            placeholder="Enter Name"
                            value={name[0]}
                            onChangeText={updateName}
                            error={name[1]}
                        />
                    </View>
                    <View style={{borderBottomColor: '#E3E3E3', borderBottomWidth: 1}}/>
                    <View style={{rowGap: 4}}>
                        <Text style={{fontSize: 16, fontWeight: "500"}}>Frequency</Text>
                        <ButtonGroup
                            value={frequency}
                            values={[["Daily", "Daily"], ["Weekly", "Weekly"]]}
                            onValueChange={setFrequency}
                        />
                    </View>
                    <View style={{borderBottomColor: '#E3E3E3', borderBottomWidth: 1}}/>
                    <View style={{rowGap: 4}}>
                        <Text style={{fontSize: 16, fontWeight: "500"}}>Habit Type</Text>
                        <Text style={{color: "#A3A3A3", marginBottom: 4}}>Lorem ipsum odor amet, consectetuer adipiscing elit. Massa nisi etiam malesuada mi luctus netus aptent natoque egestas.</Text>
                        <Toggle
                            label="Good Habit"
                            value={good}
                            values={[[false, "Bad"], [true, "Good"]]}
                            onValueChange={setGood}
                        />
                    </View>
                    <View style={{borderBottomColor: '#E3E3E3', borderBottomWidth: 1}}/>
                    <View style={{rowGap: 4}}>
                        <Text style={{fontSize: 16, fontWeight: "500", marginBottom: 4}}>Alarms</Text>
                        <Checkbox
                            value={alert}
                            label="Alert Me"
                            onValueChange={setAlert}
                        />
                        <Text style={{color: "#A3A3A3", marginBottom: 12}}>Lorem ipsum odor amet, consectetuer adipiscing elit. Massa nisi etiam malesuada mi luctus netus aptent natoque egestas.</Text>
                        {alertDates.length !== 0 &&
                            <View style={{display: "flex", rowGap: 12}}>
                                {alertDates.map((alertDate, i) => (
                                    <View key={i}>
                                        <DateTimePicker
                                            open={editAlertDateID === alertDate.id}
                                            initialValue={alertDate}
                                            onValueChange={(a) => {
                                                setAlertDates(alertDates => [...alertDates.filter(_ => _.id !== a.id), a]);
                                                setEditAlertDateID(0);
                                            }}
                                            onOpen={() => setEditAlertDateID(alertDate.id)}
                                            onClose={() => setEditAlertDateID(0)}
                                            onDelete={() => {
                                                setAlertDates(alertDates => [...alertDates.filter(_ => _.id !== alertDate.id)]);
                                                setEditAlertDateID(0);
                                            }}
                                        />
                                    </View>
                                ))}
                            </View>
                        }
                        {editAlertDateID === -1 &&
                            <DateTimePicker
                                open={true}
                                initialValue={{
                                    id: -1,
                                    day: "Sunday",
                                    hour: "12",
                                    minute: "00",
                                    time: "AM"
                                }}
                                onValueChange={(a) => {
                                    setAlertDates(currentAlertDates => [
                                        ...currentAlertDates,
                                        {...a, id: currentAlertDates.length + 1}
                                    ]);
                                    setEditAlertDateID(0);
                                }}
                                onOpen={() => setEditAlertDateID(0)}
                                onClose={() => setEditAlertDateID(0)}
                                onDelete={() => setEditAlertDateID(0)}
                            />
                        }
                        <Pressable
                            onPress={() => setEditAlertDateID(-1)}
                            style={{
                                padding: 12,
                                borderRadius: 6,
                                backgroundColor: "transparent",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                borderStyle: "dashed",
                                borderWidth: 1,
                                borderColor: "#D3D3D3",
                            }}
                        >
                            <Plus/>
                        </Pressable>
                    </View>
                    <View
                        style={{
                            borderBottomColor: '#E3E3E3',
                            borderBottomWidth: 1,
                        }}
                    />
                    <Button
                        label="Add Habit"
                        onPress={saveHabit}
                        style={{
                            backgroundColor: BLUE
                        }}
                    />
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    )
}