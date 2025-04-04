import CalendarDate from "@/components/CalendarDate";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from 'expo-sqlite';
import { router } from "expo-router";
import Header from "@/components/basic/Header";
import { Check, MoveLeft, MoveRight, Star, X } from "lucide-react-native";
import { BORDER_COLOR, BOX_SHADOW, GREEN_1, GREEN_2 } from "@/constants/design";
import ButtonIcon from "@/components/basic/ButtonIcon";
import Button from "@/components/basic/Button";

interface CalendarProps {

}

export default function Calendar(props: CalendarProps) {
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();

    const { habitID } = useLocalSearchParams();
    const [habit, setHabit] = useState<any>();
    const [isPresent, setIsPresent] = useState(false);

    const [year, setYear] = useState(0);
    const [month, setMonth] = useState(0);

    const [longestStreak, setLongestStreak] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);

    useEffect(() => {
        const date = new Date();
        setMonth(date.getMonth());
        setYear(date.getUTCFullYear());
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const load = async () => {
                try {
                    const db = await SQLite.openDatabaseAsync('databaseName');
                    setDB(db);
    
                    const habit: any = await db.getFirstAsync(`SELECT * FROM Habit WHERE ID = ${habitID}`);
                    setHabit(habit);
    
                    const today = (new Date()).toISOString().split('T')[0];
                    const isPresent: any = await db.getFirstAsync(`SELECT * FROM HabitHistory WHERE HabitID = ${habitID} AND DateCompleted = date('${today}')`);
                    setIsPresent(!!isPresent);
    
                    const habitHistory: any = await db.getAllAsync(`SELECT * FROM HabitHistory WHERE HabitID = ${habitID} ORDER BY DateCompleted ASC`);
                    console.log("Date Completed");
                    console.log(habitHistory);
                    if (!habitHistory.length)
                        return;
    
                    let longestStreak = 0;
                    let currentStreak = 0;
        
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
                catch (err) {
                    console.error(err);
                }
            }
            load();
        }, [])
    );

    const deleteHabit = async () => {
        if (!db)
            return;
        await db.runAsync(`DELETE FROM Habit WHERE ID = ${habitID}`);
        router.back();
    }

    const prevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
            return;
        }
        setMonth(month - 1);
    }

    const nextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
            return;
        }
        setMonth(month + 1);
    }

    return (
        <GestureHandlerRootView style={{backgroundColor: "white", height: "100%"}}>
            <SafeAreaView style={{paddingHorizontal: 16}}>
                {/* Header */}
                <View style={{display: "flex", flexDirection: "row", gap: 16, alignItems: "center", marginBottom: 16}}>
                    <Header
                        title={habit && habit["Name"]}
                        paragraph=""
                    />
                    <View style={{backgroundColor: isPresent ? GREEN_1 : "#EEEEEE", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 100, borderWidth: 1, borderStyle: "dashed", borderColor: isPresent ? "#50bf5d" : BORDER_COLOR}}>
                        {isPresent ? <Check size={20} strokeWidth={3} color={GREEN_2}/> : <X color="#B4B4B4" size={20} strokeWidth={3}/>}
                    </View>
                </View>
                {/* Streaks */}
                <View style={{display: "flex", flexDirection: "row", gap: 8}}>
                    <View style={{flex: 1, gap: 12, display: "flex", flexDirection: "row", alignItems: "flex-start", borderWidth: 1, boxShadow: BOX_SHADOW, borderColor: BORDER_COLOR, padding: 16, paddingHorizontal: 8, borderRadius: 18}}>
                        <View style={{height: "100%", top: 0}}>
                            <Star size={24} color={"orange"} fill={"#FFC561"}/>
                        </View>
                        <View style={{gap: 4}}>
                            <Text style={{fontSize: 20, fontWeight: 500}}>{currentStreak}</Text>
                            <Text style={{fontSize: 16, fontWeight: 400, color: "gray"}}>Current Streak</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, gap: 12, display: "flex", flexDirection: "row", alignItems: "flex-start", borderWidth: 1, boxShadow: BOX_SHADOW, borderColor: BORDER_COLOR, padding: 16, paddingHorizontal: 8, borderRadius: 18}}>
                        <View style={{height: "100%", top: 0}}>
                            <Star size={24} color={"orange"} fill={"#FFC561"}/>
                        </View>
                        <View style={{gap: 4}}>
                            <Text style={{fontSize: 20, fontWeight: 500}}>{longestStreak}</Text>
                            <Text style={{fontSize: 16, fontWeight: 400, color: "gray"}}>Longest Streak</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
            {/* Calendar */}
            <View style={{padding: 16, borderTopWidth: 1, borderTopColor: BORDER_COLOR, gap: 16}}>
                <Text style={{fontSize: 24, textAlign: "center", fontWeight: 400}}>{["January", "February", "March", "April", "May", "August", "September", "October", "November", "December"][month]}</Text>
                {/* History */}
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: "100%"
                    }}
                >
                    {["", "S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                        <View 
                            key={i}
                            style={{
                                width: "12.5%",
                                height: 0,
                                aspectRatio: 1,
                                borderWidth: 1,
                                borderBottomWidth: 0,
                                borderRightWidth: i === 7 ? 1 : 0,
                                borderColor: BORDER_COLOR,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                borderTopLeftRadius: i == 0 ? 8 : 0,
                                borderTopRightRadius: i == 7 ? 8 : 0
                            }}
                        >
                            <Text style={{color: "gray", fontWeight: 500}}>{day}</Text>
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
                                    key={dateIndex}
                                    style={{
                                        width: "12.5%",
                                        height: 0,
                                        borderLeftWidth: 1,
                                        borderColor: BORDER_COLOR,
                                        backgroundColor: [0, 16, 32].includes(dateIndex) ? "#EFEFEF" : "#FEFEFE",
                                        display: "flex",
                                        aspectRatio: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderBottomLeftRadius: dateIndex === 32 ? 8 : 0,
                                        borderBottomWidth: dateIndex === 32 ? 1 : 0
                                    }}
                                >
                                    <Text
                                        style={{fontWeight: 500, color: "gray"}}
                                    >
                                        {date.getMonth()+1}-{date.getDate()}
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
                                key={dateIndex}
                                style={{
                                    borderWidth: 1,
                                    borderBottomWidth: dateIndex >= 32 ? 1 : 0,
                                    borderRightWidth: [7, 15, 23, 31, 39].includes(dateIndex) ? 1 : 0,
                                    borderColor: BORDER_COLOR,
                                    width: "12.5%",
                                    aspectRatio: 1,
                                    height: 0,
                                    borderBottomRightRadius: dateIndex === 39 ? 8 : 0
                                }}
                            >
                                <CalendarDate
                                    habitID={habitID as unknown as number}
                                    date={date}
                                />
                            </View>
                        )
                    }))}
                </View>
                {/* Navigate Through Calendar */}
                <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: 4 * 8}}>
                    <ButtonIcon 
                        onPress={prevMonth}
                    >
                        <MoveLeft color="#C4C4C4" size={18} strokeWidth={3}/>
                    </ButtonIcon>
                    <ButtonIcon 
                        onPress={nextMonth}
                    >
                        <MoveRight color="#C4C4C4" size={18} strokeWidth={3}/>
                    </ButtonIcon>
                </View>
            </View>
            {/* Delete Button */}
            <View style={{padding: 16, borderTopWidth: 1, borderTopColor: BORDER_COLOR}}>
                {/* Delete Habit */}
                <Button label="Delete Habit" onPress={deleteHabit} style={{backgroundColor: "#e01d1d"}}/>
            </View>
        </GestureHandlerRootView>
    )
}