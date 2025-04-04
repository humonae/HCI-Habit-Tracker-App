import ButtonGroup from "@/components/ButtonGroup";
import Checkbox from "@/components/Checkbox";
import DateTimePicker, { DateTime } from "@/components/DateTimePicker";
import Toggle from "@/components/Toggle";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';
import TextField from "@/components/TextField";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Field } from "@/components/Field";
import { EMAIL_REGEX, NAME_REGEX } from "@/constants/regex";
import Button from "@/components/basic/Button";
import { BLUE, HORIZONTAL_PADDING, VERTICAL_PADDING } from "@/constants/design";
import Header from "@/components/basic/Header";
import ErrorMessage from "@/components/basic/ErrorMessage";

export default function SignUp() {
    const router = useRouter();
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    const [error, setError] = useState("");

    // Sign Up Information
    const [fName, setFName] = useState<Field>(["", null]);
    const [lName, setLName] = useState<Field>(["", null]);
    const [email, setEmail] = useState<Field>(["", null]);
    const [password, setPassword] = useState<Field>(["", null]);

    // Array of Used Emails
    const [emails, setEmails] = useState<Array<string>>([]);

    useEffect(() => {
        const load = async () => {    
            try {        
                const db = await SQLite.openDatabaseAsync('databaseName');      
                setDB(db);

                if (!db)
                    return;

                // To make sure that the user doesn't enter an existing email,
                // we fetch the existing email addresses.
                const emails: any = await db.getAllAsync('SELECT Email FROM User');
                setEmails(emails.map((email: any) => email["Email"]));
            }
            catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    const updateFName = (fName: string): boolean => {
        let error = "";
        if (!fName.match(NAME_REGEX))
            error += "Please enter a valid name.";
        setFName([fName, error]);
        return !!!error;
    }

    const updateLName = (lName: string): boolean => {
        let error = "";
        if (!lName.match(NAME_REGEX))
            error += "Please enter a valid name.";
        setLName([lName, error]);
        return !!!error;
    }

    const updateEmail = (email: string): boolean => {
        let error = "";
        if (emails.findIndex(e => e === email) !== -1)
            error += "Email address already exists. ";
        if (!email.match(EMAIL_REGEX))
            error += "Please enter a valid email address. ";
        setEmail([email, error]);
        return !!!error;
    }
    
    const updatePassword = (password: string) => {
        let error = "";
        if (password.length < 3)
            error += "Password must have at least 3 characters.";
        setPassword([password, error]);
        return !!!error;
    }

    const signUp = async () => {
        if (!db)
            return;

        // Checking Fields
        const fieldValidity = [updateFName(fName[0]), updateLName(lName[0]), updateEmail(email[0]) , updatePassword(password[0])];
        if (fieldValidity.findIndex(v => !v) !== -1)
            return;

        try {
            const user = await db.runAsync(`
                INSERT INTO User (FName, LName, Email, Password) 
                VALUES (
                    '${fName[0]}', 
                    '${lName[0]}', 
                    '${email[0]}',
                    '${password[0]}'
                );
            `);
            const userID: number = user.lastInsertRowId;
            await AsyncStorage.setItem('userID', userID.toString());
            router.replace('/dashboard');
        }
        catch (err) {
            setError("Unable to create account. Please try again");
            console.error(err);
        }
    }

    return (
        <GestureHandlerRootView style={{backgroundColor: "white", height: "100%", padding: 0, margin: 0}}>
            <View style={{paddingVertical: VERTICAL_PADDING * 11, paddingHorizontal: HORIZONTAL_PADDING * 2, gap: 32, backgroundColor: "white"}}>
                <Header
                    title="Sign Up" 
                    paragraph="To start keeping track of your habits, create an account here."
                />
                {error &&
                    <ErrorMessage
                        error={error}
                    />
                }
                <View style={{display: "flex", flexDirection: "column", gap: 16}}>
                    <TextField
                        value={fName[0]}
                        placeholder="First Name"
                        onChangeText={text => updateFName(text)}
                        error={fName[1]}
                    />
                    <TextField
                        value={lName[0]}
                        placeholder="Last Name"
                        onChangeText={text => updateLName(text)}
                        error={lName[1]}
                    />
                    <TextField
                        value={email[0]}
                        placeholder="Email Address"
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
                            label="Create Account"
                            onPress={signUp}
                            style={{
                                backgroundColor: BLUE
                            }}
                        />    
                        <Pressable onPress={() => {router.replace("/")}}>
                            <Text style={{textAlign: "center", fontWeight: 400}}>Already have an account? <Text style={{fontWeight: 600, color: BLUE}}>Log In</Text></Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </GestureHandlerRootView>
    )
}