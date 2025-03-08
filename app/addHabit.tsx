import ButtonGroup from "@/components/ButtonGroup";
import Checkbox from "@/components/Checkbox";
import DateTimePicker, { DateTime } from "@/components/DateTime";
import Toggle from "@/components/Toggle";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import * as SQLite from 'expo-sqlite';
import { router } from 'expo-router';

export default function AddHabit() {
    const [userID, setUserID] = useState(0);
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    const [name, setName] = useState("");
    const [frequency, setFrequency] = useState("Daily");
    const [habitType, setHabitType] = useState(true);
    const [alertMe, setAlertMe] = useState(false);
    const [alertDates, setAlertDates] = useState<Array<DateTime>>([]);
    const [editAlertDateID, setEditAlertDateID] = useState(0);

    useEffect(() => {
        const load = async () => {    
            try {        
                const db = await SQLite.openDatabaseAsync('databaseName');      
                const firstUser: any = await db.getFirstAsync('SELECT * FROM User');
                const firstHabit: any = await db.getFirstAsync('SELECT * FROM Habit');
                console.log(firstUser, firstHabit);   
                setDB(db);
            }
            catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    const saveHabit = async () => {
        if (!db)
            return;

        try {
            await db.execAsync(`
                INSERT INTO Habit (Name, Frequency, GoodHabit, AlertMe, UserID) VALUES ('${name}', '${frequency}', ${habitType ? 1 : 0}, ${alertMe ? 1 : 0}, ${userID});
            `);
            const habits: any = await db.getAllAsync('SELECT * FROM Habit');
            
            const lastInsertedHabitID = habits[habits.length - 1].ID;
            for (const alertDate of alertDates) {
                await db.execAsync(`
                    INSERT INTO Alarms (Day, Hour, Minute, Time, HabitID) VALUES ('${alertDate.day}', '${alertDate.hour}', '${alertDate.minute}', '${alertDate.time}', ${lastInsertedHabitID});
                `);
            }
            
            router.back();
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <View style={{rowGap: 0}}>
            <TextInput
                style={{marginHorizontal: 24, marginTop: 24, height: 60, padding: 5, fontSize: 32}}
                placeholder="Habit Name"
                onChangeText={text => setName(text)}
                defaultValue={""}
            />
            <View
                style={{
                    padding: 24,
                    paddingTop: 0,
                    display: "flex",
                    rowGap: 24
                }}
            >
                <View
                    style={{
                        borderBottomColor: '#E3E3E3',
                        borderBottomWidth: 1,
                    }}
                />
                <View style={{rowGap: 4}}>
                    <Text style={{fontSize: 16, fontWeight: "500"}}>Frequency</Text>
                    <ButtonGroup
                        value={frequency}
                        values={[["Daily", "Daily"], ["Weekly", "Weekly"], ["Custom", "Custom"]]}
                        onValueChange={setFrequency}
                    />
                </View>
                <View
                    style={{
                        borderBottomColor: '#E3E3E3',
                        borderBottomWidth: 1,
                    }}
                />
                <View style={{rowGap: 4}}>
                    <Text style={{fontSize: 16, fontWeight: "500"}}>Habit Type</Text>
                    <Text style={{color: "#A3A3A3", marginBottom: 4}}>Lorem ipsum odor amet, consectetuer adipiscing elit. Massa nisi etiam malesuada mi luctus netus aptent natoque egestas.</Text>
                    <Toggle
                        label="Good Habit"
                        value={habitType}
                        values={[[false, "Bad"], [true, "Good"]]}
                        onValueChange={setHabitType}
                    />
                </View>
                <View
                    style={{
                        borderBottomColor: '#E3E3E3',
                        borderBottomWidth: 1,
                    }}
                />
                <View style={{rowGap: 4}}>
                    <Text style={{fontSize: 16, fontWeight: "500", marginBottom: 4}}>Alarms</Text>
                    <Checkbox
                        value={alertMe}
                        label="Alert Me"
                        onValueChange={setAlertMe}
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
                <Pressable
                    onPress={async () => {
                        await saveHabit();
                    }}
                    style={{
                        padding: 12,
                        borderRadius: 6,
                        backgroundColor: "#007AFF",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{fontSize: 20, fontWeight: "medium", color: "white"}}>Add Habit</Text>
                </Pressable>
            </View>
        </View>
    )
}