import { View, Text, Button, Alert, Pressable } from "react-native";
import ButtonWrapper from "@/components/ButtonWrapper";
import React, { useState, useEffect } from "react";
import * as SQLite from 'expo-sqlite';
import { useRouter } from "expo-router";
import { BORDER_COLOR, BOX_SHADOW, BOX_SHADOW_MD, HORIZONTAL_PADDING, VERTICAL_PADDING } from "@/constants/design";
import { BadgePlus, BookPlus, Calendar, Check, NotebookText, NotepadText, Pencil, ScrollText, Star, X } from "lucide-react-native";

interface HabitProps {
    id: number;
    name: string;  
    good: number; 
}

export default function Habit(props: HabitProps) {
    const router = useRouter();
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    const [logged, setLogged] = useState(false);
    const [weekStreak, setWeekStreak] = useState(Array(7).fill(false));
    const [streakNumber, setStreakNumber] = useState(0);
    const [unclickedColor, setUnclickedColor] = useState(props.good ? '#eee' : '#E9FAE3');
    const [clickedColor, setClickedColor] = useState(props.good ? '#E9FAE3' : '#facaca');
    const [loggedStreakTextColor, setLoggedStreakTextColor] = useState(props.good ? '#9BD199' : '#eb8f8f');
    const [unloggedStreakTextColor, setUnloggedStreakTextColor] = useState(props.good ? '#C4C4C4' : '#9BD199');


    useEffect(() => {
        const load = async () => {    
            try {        
                const db = await SQLite.openDatabaseAsync('databaseName');     
                setDB(db);

                const dates: any = await db.getAllAsync(`
                    SELECT * FROM HabitHistory;
                `);

                /*await db.execAsync(`
                    DELETE FROM HabitHistory;
                `);*/

                //console.log(dates);

                /*await db.execAsync(`
                    INSERT INTO HabitHistory (HabitID, DateCompleted) VALUES (1, '2025-04-01');
                `);*/
            }
            catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    useEffect(() => {
        const loadStreakInfo = async () => {
            if (await habitIsPresent()) {
                setLogged(true);
                await calculateStreak();
                await buildWeekStreak();
                console.log(props.id + 'present');
            }
            if (!(await habitIsPresent())) {
                setLogged(false);
                await calculateStreak();
                await buildWeekStreak();
                console.log(props.id + 'absent');
            }
        };
        loadStreakInfo();
    }, [db]);

     const logHabit = async () => {
        if (!db)
            return;

        try {
            const date = (new Date()).toISOString().split('T')[0];

            await db.execAsync(`
                INSERT INTO HabitHistory (HabitID, DateCompleted) VALUES ('${props.id}', '${date}');
            `);
            setLogged(true);

            // update the weekly streak bar
            setWeekStreak(prevState => {
                const updatedStates = [...prevState];
                updatedStates[6] = true;
                return updatedStates;
            });
            setStreakNumber(streakNumber + 1);
        }
        catch (err) {
            console.error(err);
        }
    }

    const unlogHabit = async () => {
        if (!db)
            return;

        try {
            const date = (new Date()).toISOString().split('T')[0];

            await db.execAsync(`
                DELETE FROM HabitHistory WHERE HabitID = '${props.id}' AND DateCompleted = '${date}';
            `);
            setLogged(false);

            // update the weekly streak bar
            setWeekStreak(prevState => {
                const updatedStates = [...prevState];
                updatedStates[6] = false;
                return updatedStates;
            });
            setStreakNumber(streakNumber - 1);
        }
        catch (err) {
            console.error(err);
        }
    }

    const habitIsPresent = async () => {
        if (!db) {
            return;
        }

        try {
            const currDate = (new Date()).toISOString().split('T')[0];

            const dates: any = await db.getAllAsync(`
                SELECT * FROM HabitHistory WHERE HabitID = '${props.id}' AND DateCompleted = '${currDate}';
            `);

            if (dates && !dates.length) {
                setLogged(false);
                return false;
            } else {
                setLogged(true);
                return true;
            }

        }
        catch (err) {
            console.error(err);
        }
    }

    const calculateStreak = async () => {
        if (!db) {
            return;
        }

        try {
            let currDate = new Date();
            let currDateText = currDate.toISOString().split('T')[0];

            const dates: any = await db.getAllAsync(`
                SELECT * FROM HabitHistory WHERE HabitID = '${props.id}' AND DateCompleted = '${currDateText}';
            `);
            console.log(dates);

            let streakEnded = (!dates || dates.length === 0);
            let count = 0;

            while (!streakEnded) {
                count++;
                currDate.setDate(currDate.getDate() - 1);
                currDateText = currDate.toISOString().split('T')[0];

                const dates: any = await db.getAllAsync(`
                    SELECT * FROM HabitHistory WHERE HabitID = '${props.id}' AND DateCompleted = '${currDateText}';
                `);
                //console.log(dates);

                streakEnded = (!dates || dates.length === 0);
            }

            if (logged) {
                count++;
            }

            setStreakNumber(count);
        }
        catch (err) {
            console.error(err);
        }
    }

    const buildWeekStreak = async () => {
        if (!db) {
            return;
        }

        try {
            let currDate = new Date();
            currDate.setDate(currDate.getDate() - 6);
            let currDateText = currDate.toISOString().split('T')[0];

            /*for (let i = 0; i < 7; i++) {
                setWeekStreak(prevState => {
                    const updatedStates = [...prevState];
                    updatedStates[i] = false;
                    return updatedStates;
                });
            }*/

            for (let i = 0; i < 7; i++) {
                //console.log(currDateText);
                //console.log(props.id);
                const dates: any = await db.getAllAsync(`
                    SELECT * FROM HabitHistory WHERE HabitID = '${props.id}' AND DateCompleted = '${currDateText}';
                `);
                const present = !(dates.length === 0);
                //console.log(present);
                //console.log(dates);

                setWeekStreak(prevState => {
                    const updatedStates = [...prevState];
                    updatedStates[i] = present;
                    return updatedStates;
                });

                currDate.setDate(currDate.getDate() + 1);
                currDateText = currDate.toISOString().split('T')[0];
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleLogPress = async () => {
        if (await habitIsPresent()) {
            unlogHabit();
        } else {
            logHabit();
        }   
    }

    const handleHabitPress = async () => {
        router.push({ pathname: '/calendar', params: { habitID: props.id } });
        return null;
    }

    const handleNotePress = async () => {
        router.push({ pathname: '/addNote', params: { habitID: props.id } });
    }

    return (
        <Pressable onPress={handleHabitPress}>
            <View style={{
                backgroundColor: "white",
                width: "100%",
                borderWidth: 1,
                borderColor: BORDER_COLOR,
                borderRadius: 10,
                boxShadow: BOX_SHADOW
            }}>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: "auto", paddingHorizontal: HORIZONTAL_PADDING * 2, paddingVertical: VERTICAL_PADDING * 2, borderBottomWidth: 1, borderBottomColor: BORDER_COLOR}}>
                    {/* Habit Name */}
                    <Text style={{fontSize: 24, fontWeight: "400"}}>{props.name}</Text>
                    {/* Buttons */}
                    <View style={{display: "flex", flexDirection: "row", gap: VERTICAL_PADDING * 2}}>
                        {/* Log Press */}
                        <Pressable
                            onPress={(event) => {
                                event.stopPropagation();
                                handleLogPress();
                            }}
                            style={{borderRadius: 100, width: 32, height: 32, backgroundColor: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", borderWidth: 0, borderColor: "#C4C4C4"}}
                        >
                            <BadgePlus size={20} color="#C4C4C4"/>
                        </Pressable>
                        {/* Note Press */}
                        <Pressable
                            onPress={(event) => {
                                event.stopPropagation();
                                handleNotePress();
                            }}
                            style={{borderRadius: 100, width: 32, height: 32, backgroundColor: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", borderWidth: 0, borderColor: "#C4C4C4"}}
                        >
                            <ScrollText size={20} color="#C4C4C4"/>
                        </Pressable>
                        {/* Calendar Press */}
                        <Pressable
                            onPress={(event) => {
                                event.stopPropagation();
                                handleHabitPress();
                            }}
                            style={{borderRadius: 100, width: 32, height: 32, backgroundColor: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", borderWidth: 0, borderColor: "#C4C4C4"}}
                        >
                            <Calendar size={20} color="#C4C4C4"/>
                        </Pressable>
                    </View>
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{display: 'flex', flexDirection: 'row', gap: 5, borderRightWidth: 1, paddingHorizontal: HORIZONTAL_PADDING * 2, paddingVertical: VERTICAL_PADDING * 2, borderRightColor: BORDER_COLOR}}>
                        {weekStreak.map((day, i) => (
                            <View 
                                key={i} 
                                style={{
                                    backgroundColor: (day ? clickedColor : unclickedColor), 
                                    borderRadius: 8, 
                                    width: 36, 
                                    height: 36,
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center"
                                }}
                            >
                                {day ? (props.good ? <Check color={loggedStreakTextColor} strokeWidth={3}/> : <X color={loggedStreakTextColor} strokeWidth={3}/>) : (props.good ? <X color={unloggedStreakTextColor} strokeWidth={3}/> : <Check color={unloggedStreakTextColor} strokeWidth={3}/>)}
                            </View>
                        ))}
                    </View>
                    <View style={{display: "flex", flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", flex: 1}}>
                        <Star size={24} color={logged ? "orange" : "#C4C4C4"} fill={logged ? "#FFC561" : "#C4C4C4"}/>
                        <Text style={{fontSize: 20, fontWeight: 500}}>{streakNumber}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}