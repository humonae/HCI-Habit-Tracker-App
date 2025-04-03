import CalendarDate from "@/components/CalendarDate";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from 'expo-sqlite';
import { router } from "expo-router";

interface CalendarProps {

}

export default function Calendar(props: CalendarProps) {
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();

    const { habitID } = useLocalSearchParams();
    const [habit, setHabit] = useState<any>();
    const [isPresent, setIsPresent] = useState(false);

    const [day, setDay] = useState<number|null>(null);
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState(0);

    const [longestStreak, setLongestStreak] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);

    useEffect(() => {
        const date = new Date();
        console.log(date.getDate());
        console.log(date.getDay());
        console.log(date.getMonth());
        console.log(date.getUTCFullYear());

        console.log("Month: " + date.getMonth() + ", Year: " + date.getUTCFullYear());
        setMonth(date.getMonth());
        setYear(date.getUTCFullYear());
        setDay(null);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const load = async () => {
                const db = await SQLite.openDatabaseAsync('databaseName');
                setDB(db);

                const habit: any = await db.getFirstAsync(`SELECT * FROM Habit WHERE ID = ${habitID}`);
                console.log(habit);
                setHabit(habit);

                const today = (new Date()).toISOString().split('T')[0];
                const isPresent: any = await db.getFirstAsync(`SELECT * FROM HabitHistory WHERE HabitID = ${habitID} AND DateCompleted = ${today}`);
                console.log(!!isPresent);
                setIsPresent(!!isPresent.length);

                const habitHistory: any = await db.getAllAsync(`SELECT * FROM HabitHistory WHERE HabitID = ${habitID} ORDER BY DateCompleted ASCENDING`);
                if (!habitHistory.length)
                    return;

                let longestStreak = 0;
                let currentStreak = 0;
                console.log(habitHistory);
                let date = new Date(habitHistory[0]["DateCompleted"]);
                for (let i = 0; i < habitHistory.length; i++) {
                    const currDate = new Date(habitHistory[i]["DateCompleted"]);
                    if (currDate.toISOString() === date.toISOString()) {
                        currentStreak++;
                        longestStreak = Math.max(longestStreak, currentStreak);
                        date = currDate;
                    }
                    else {
                        currentStreak = 0;
                        date = currDate;
                    }
                }

                setLongestStreak(longestStreak);
                setCurrentStreak(currentStreak);
            }
            load();
        }, [year, month])
    );

    const deleteHabit = async () => {
        if (!db)
            return;
        await db.runAsync(`DELETE FROM Habit WHERE ID = ${habitID}`);
        router.back();
    }

    return (
        <GestureHandlerRootView>
            <SafeAreaView>
                <Text style={{fontSize: 50, color: "black"}}>{habit && habit["Name"]}</Text>
                {!isPresent && <Text>Gray Cross</Text>}
                {isPresent && <Text>Green Check</Text>}
                <Text>Longest Streak: {longestStreak}</Text>
                <Text>Current Streak: {currentStreak}</Text>
                <Pressable
                    style={{
                        width: 40,
                        height: 40, 
                        backgroundColor: "pink"
                    }}
                    onPress={deleteHabit}
                >
                    <Text>Delete Habit</Text>
                </Pressable>
            </SafeAreaView>
            <SafeAreaView
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    backgroundColor: "red",
                    width: "100%"
                }}
            >
                {["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, i) => (
                    <View 
                        key={i}
                        style={{
                            width: "12.5%",
                            height: "auto",
                            aspectRatio: 1,
                            borderWidth: 1,
                            borderColor: "black"
                        }}
                    >
                        <Text>{day}</Text>
                    </View>    
                ))}
                {Array.from(Array(40).keys()).map((dateIndex => {
                    if ((dateIndex) % 8 == 0) {
                        const startDate = new Date(year, month, 1);
                        const startDay = startDate.getDay();

                        const updatedIndex = dateIndex - Math.floor(dateIndex/8);
                        const date = new Date(startDate);
                        if (updatedIndex !== startDay)
                            date.setDate(updatedIndex - startDay + 1);

                        return (
                            <View     
                                style={{
                                    width: "12.5%",
                                    backgroundColor: "green",
                                    aspectRatio: 1,
                                    borderWidth: 1,
                                    borderColor: "black"
                                }}
                            >
                                <Text                             
                                    key={dateIndex}
                                >
                                    {date.getMonth()+1}/{date.getDate()}
                                </Text>
                            </View>
                        )
                    }
                    const startDate = new Date(year, month, 1);
                    const startDay = startDate.getDay();

                    const updatedIndex = dateIndex - (Math.floor(dateIndex/8) + 1);
                    const date = new Date(startDate);
                    if (updatedIndex !== startDay)
                        date.setDate(updatedIndex - startDay + 1);
                       
                    return (
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: "black",
                                backgroundColor: dateIndex % 2 == 0 ? "white" : "blue",
                                width: "12.5%",
                                height: undefined,
                                aspectRatio: 1,
                            }}
                        >
                            {/* <Text>{JSON.stringify(date)}</Text>  */}
                            <Text>{date.getDate()}</Text>
                            <CalendarDate
                                habitID={habitID as unknown as number}
                                date={date}
                            />
                        </View>
                    )
                }))}
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}