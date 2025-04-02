import { View, Text, Button, Alert } from "react-native";
import ButtonWrapper from "@/components/ButtonWrapper";
import React, { useState, useEffect } from "react";
import * as SQLite from 'expo-sqlite';
import uuid from 'react-native-uuid';


interface HabitProps {
    name: string;   
    id: string;
}

export default function Habit(props: HabitProps) {
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    const [text, setText] = useState('hi');
    const [logged, setLogged] = useState(false);
    const [weekStreak, setWeekStreak] = useState(Array(7).fill(false));
    const [streakNumber, setStreakNumber] = useState();

    useEffect(() => {
        const load = async () => {    
            try {        
                const db = await SQLite.openDatabaseAsync('databaseName');     
                setDB(db);

                /*await db.execAsync(`
                    INSERT INTO HabitHistory (HabitID, DateCompleted) VALUES (1, '2025-03-29');
                `);*/
            }
            catch (err) {
                console.error(err);
            }
        }
        load();
        //buildWeekStreak();
    }, []);

     const logHabit = async () => {
        if (!db)
            return;

        try {
            const date = (new Date()).toISOString().split('T')[0];

            await db.execAsync(`
                INSERT INTO HabitHistory (HabitID, DateCompleted) VALUES ('${props.id}', '${date}');
            `);
            setLogged(true);
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
                return false;
            } else {
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
                SELECT * FROM HabitHistory WHERE HabitID = '${props.id}' AND DateCompleted = '${currDate}';
            `);

            let streakEnded = !(dates && !dates.length);
            let count = 0;

            while (!streakEnded) {
                count++;
                currDate.setDate(currDate.getDate() - 1);
                currDateText = currDate.toISOString().split('T')[0];

                const dates: any = await db.getAllAsync(`
                    SELECT * FROM HabitHistory WHERE HabitID = '${props.id}' AND DateCompleted = '${currDateText}';
                `);
                console.log(dates);

                streakEnded = (dates && !dates.length);
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
            calculateStreak();
            buildWeekStreak();
        }   
    }

    const handleNotePress = async () => {

    }

    return (
        <View style={{
            padding: 12,
            backgroundColor: "white",
            width: "100%",
            borderRadius: 8,
            boxShadow: "0px 1px 4px 0px #00000010"
        }}>
            <Text style={{fontSize: 24, fontWeight: "400", paddingBottom: 15}}>{props.name}</Text>
            <View style={{position: 'absolute', top: 7, right: 10, color: (logged ? '#eee' : '#bbb'), backgroundColor: (logged ? '#2b4' : '#eee'), borderRadius: 100, width: 40, height: 40}}>
                <Button title="✓" onPress={handleLogPress} color='#222'/>
            </View>
            <View style={{position: 'absolute', top: 7, right: 56, backgroundColor: '#eee', borderRadius: 100, width: 40, height: 40}}>
                <Button title="✎" onPress={handleNotePress} color='#222'/>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 5
              }}
            >
              {weekStreak.map((day, i) => (
                <View key={i} style={{backgroundColor: (day ? '#2b4' : '#eee'), borderRadius: 2, width: 35, height: 40}}>
                  <Text style={{fontSize: 27, color: (day ? '#040' : '#fff'), left: (day ? 6 : 9), top: 3}}>{day ? '✓' : 'X'}</Text>
                </View>
              ))}
              <Text style={{position: 'absolute', right: -3, bottom: -5, fontSize: 42, color: (logged ? '#2b4' : '#eee')}}>★</Text>
              <Text style={{position: 'absolute', right: (streakNumber == 1 ? 12 : 9), bottom: 2, fontSize: 30}}>{streakNumber}</Text>
            </View>
        </View>
    )
}