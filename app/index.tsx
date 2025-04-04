import { useEffect, useState } from "react";
import { Text, View, Pressable, KeyboardAvoidingView } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';
import TextField from "@/components/TextField";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Field } from "@/components/Field";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import Header from "@/components/basic/Header";
import { Image } from 'expo-image';
import { BLUE, HORIZONTAL_PADDING, VERTICAL_PADDING } from "@/constants/design";
import Button from "@/components/basic/Button";
import { EMAIL_REGEX } from "@/constants/regex";
import { CircleAlert, CircleOff, CircleX, OctagonAlert } from "lucide-react-native";
import ErrorMessage from "@/components/basic/ErrorMessage";

export default function Index() {
    const router = useRouter();
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    const [email, setEmail] = useState<Field>(["", null]);
    const [password, setPassword] = useState<Field>(["", null]);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {    
            try {        
                const db = await SQLite.openDatabaseAsync('databaseName');      
                setDB(db);
                
                // View Logins
                // In case you can't remember the logins, they will be shown in
                // the console.
                const result: any = await db.getFirstAsync(`SELECT * FROM User;`);
                console.log(result);
            }
            catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    useEffect(() => {
        const initializeDatabase = async () => {
            if (!db)
                return;
            try {
                await db.execAsync(`
                    PRAGMA foreign_keys = ON;
                    CREATE TABLE IF NOT EXISTS User (ID INTEGER PRIMARY KEY, FName TEXT NOT NULL, LName TEXT NOT NULL, Email TEXT NOT NULL UNIQUE, Password TEXT NOT NULL);
                    CREATE TABLE IF NOT EXISTS Habit (ID INTEGER PRIMARY KEY, UserID INTEGER NOT NULL, Frequency TEXT NOT NULL, Name TEXT NOT NULL, Good INTEGER NOT NULL, Alert INTEGER NOT NULL, FOREIGN KEY(UserID) REFERENCES User(ID) ON DELETE CASCADE);
                    CREATE TABLE IF NOT EXISTS HabitJournal (ID INTEGER PRIMARY KEY, HabitID INTEGER NOT NULL, CreationDate DATETIME NOT NULL DEFAULT CURRENT_DATE, Content TEXT NOT NULL, FOREIGN KEY(HabitID) REFERENCES Habit(ID) ON DELETE CASCADE);
                    CREATE TABLE IF NOT EXISTS HabitHistory (HabitID INTEGER NOT NULL, DateCompleted DATE NOT NULL DEFAULT CURRENT_DATE, FOREIGN KEY(HabitID) REFERENCES Habit(ID) ON DELETE CASCADE, PRIMARY KEY(HabitID, DateCompleted));
                    CREATE TABLE IF NOT EXISTS HabitAlarms (ID INTEGER PRIMARY KEY, HabitID INTEGER NOT NULL, Alarm DATETIME NOT NULL, FOREIGN KEY(HabitID) REFERENCES Habit(ID) ON DELETE CASCADE);
                `);
            }
            catch (err) {
                console.error(err);
            }
        }
        initializeDatabase();
    }, [db]);

    const logIn = async () => {
        const fieldValidity = [updateEmail(email[0]) , updatePassword(password[0])];
        if (fieldValidity.findIndex(v => !v) !== -1) 
            return;

        if (!db)
            return;

        try {
            const user: any = await db.getFirstAsync(`
                SELECT  ID 
                FROM    User 
                WHERE   UPPER(Email) = '${email[0].toUpperCase()}' AND 
                        Password = '${password[0]}';
            `);
            const userID: number = user["ID"];
            
            // Close DB
            await db.closeAsync();

            // Save Information
            await AsyncStorage.setItem('userID', userID.toString());
            router.replace('/dashboard');
        }
        catch (err) {
            setError("No account with the given username and password exists. Please try again.");
            console.error(err);
        }
    }

    const updateEmail = (email: string): boolean => {
        let error = "";
        if (!email.match(EMAIL_REGEX))
            error += "Please enter a valid email address.";
        setEmail([email, error]);
        return !!!error;
    }

    const updatePassword = (password: string) => {
        let error = "";
        if (!password)
            error += "Please enter a password.";
        setPassword([password, error]);
        return !!!error;
    }
  
    return (
        <GestureHandlerRootView>
            <View style={{}}>
                {/* <Text style={{position: "absolute", color: "white", zIndex: 100, textAlign: "center", top: 100}}>Tracker</Text> */}
                <Image
                    style={{
                        height: "40%",
                        width: "100%",
                    }}
                    source={require('../assets/images/Login.jpg')}
                    placeholder={{ blurhash: '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[' }}
                    contentFit="cover"
                    transition={1000}
                />
                <ScrollView>
                    <View style={{paddingHorizontal: 16, paddingVertical: 16, gap: 24}}>
                        <Header 
                            title="Login" 
                            paragraph="To start keeping track of your habits, log into your account here."
                        />
                        {!!error &&
                            <ErrorMessage
                                error={error}
                            />
                        }
                        <KeyboardAvoidingView behavior={"padding"} style={{display: "flex", flex: 1, gap: 16}}>
                            <TextField
                                value={email[0]}
                                placeholder="Email"
                                onChangeText={text => updateEmail(text)}
                                error={email[1]}
                            />
                            <TextField
                                value={password[0]}
                                placeholder="Password"
                                onChangeText={text => updatePassword(text)}
                                error={password[1]}
                            />
                            <View style={{gap: 8}}>
                                <Button
                                    label="Log In"
                                    onPress={logIn}
                                />    
                                <Pressable onPress={() => {router.replace("/signup")}}>
                                    <Text style={{textAlign: "center", fontWeight: 400}}>Don't have an account? <Text style={{fontWeight: 600, color: BLUE}}>Sign Up</Text></Text>
                                </Pressable>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    )
}