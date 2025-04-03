import { View, Text, Button, Alert, Pressable } from "react-native";
import ButtonWrapper from "@/components/ButtonWrapper";
import React, { useState, useEffect } from "react";
import * as SQLite from 'expo-sqlite';
import { useRouter } from "expo-router";

interface HabitProps {
    id: number;
    name: string;  
    good: number; 
}

export default function Habit(props: HabitProps) {
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    const [text, setText] = useState('hi');
    const [logged, setLogged] = useState(false);
    const [weekStreak, setWeekStreak] = useState(Array(7).fill(false));
    const [streakNumber, setStreakNumber] = useState(0);
    const [unclickedColor, setUnclickedColor] = useState(props.good ? '#eee' : '#9fe3ae');
    const [clickedColor, setClickedColor] = useState(props.good ? '#2b4' : '#e08989');
    const [loggedStreakTextColor, setLoggedStreakTextColor] = useState(props.good ? '#040' : '#f5b0b0');
    const [unloggedStreakTextColor, setUnloggedStreakTextColor] = useState(props.good ? '#fff' : '#bdf2c9');
    const [loggedButtonSymbol, setLoggedButtonSymbol] = useState(props.good ? '✓' : 'X');
    const [unloggedButtonSymbol, setUnloggedButtonSymbol] = useState(props.good ? 'X' : '✓');


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

    }

    const router = useRouter();

    return (
        <Pressable
            onPress={() => {
                router.push({ pathname: '/calendar', params: { habitID: props.id } });
                return null;
            }}
        >
            <View style={{
                padding: 12,
                backgroundColor: "white",
                width: "100%",
                borderRadius: 8,
                boxShadow: "0px 1px 4px 0px #00000010"
            }}>
                <Text style={{fontSize: 24, fontWeight: "400", paddingBottom: 15}}>{props.name}</Text>
                <View style={{position: 'absolute', top: 7, right: 10, borderRadius: 100, width: 40, height: 40}}>
                    <Button title="❯" onPress={handleHabitPress} color='#eee'/>
                </View>
                <View style={{position: 'absolute', top: 7, right: 56, color: (logged ? '#eee' : '#bbb'), backgroundColor: (logged ? clickedColor : unclickedColor), borderRadius: 100, width: 40, height: 40}}>
                    <Button title={loggedButtonSymbol} onPress={handleLogPress} color='#222'/>
                </View>
                <View style={{position: 'absolute', top: 7, right: 102, backgroundColor: '#eee', borderRadius: 100, width: 40, height: 40}}>
                    <Button title="✎" color='#222' onPress={() => {
                        router.push({ pathname: '/addNote', params: { habitID: props.id } });
                        return null;
                    }}/>
                </View>

                <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 5
                }}
                >
                {weekStreak.map((day, i) => (
                    <View key={i} style={{backgroundColor: (day ? clickedColor : unclickedColor), borderRadius: 2, width: 35, height: 40}}>
                    <Text style={{fontSize: 27, color: (day ? loggedStreakTextColor : unloggedStreakTextColor), left: (day ? (props.good ? 6 : 9) : (props.good ? 9 : 6)), top: 3}}>{day ? loggedButtonSymbol : unloggedButtonSymbol}</Text>
                    </View>
                ))}
                <Text style={{position: 'absolute', right: -3, bottom: -5, fontSize: 42, color: (logged ? clickedColor : unclickedColor)}}>★</Text>
                <Text style={{position: 'absolute', right: (streakNumber == 1 ? 12 : 9), bottom: 2, fontSize: 30}}>{streakNumber}</Text>
                </View>
            </View>
        </Pressable>
    )
}