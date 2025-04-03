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

// The first element is the value of the field,
// the second element is an error message for
// that field, if any.
export type Field = [string, string|null];

export default function SignUp() {
    const router = useRouter();
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    const [fName, setFName] = useState<Field>(["", null]);
    const [lName, setLName] = useState<Field>(["", null]);
    const [emailAddress, setEmailAddress] = useState<Field>(["", null]);
    const [password, setPassword] = useState<Field>(["", null]);
    const [emailAddresses, setEmailAddresses] = useState<Array<string>>([]);
    // This will be updated after the user signs up, and will consequently
    // be put into storage so that we can reference the user's ID across files.;

    useEffect(() => {
        const load = async () => {    
            try {        
                const db = await SQLite.openDatabaseAsync('databaseName');      
                setDB(db);

                if (!db)
                    return;

                // This is probably something you shouldn't do
                // in code that is actually used, but just to
                // figure out everything.
                const emailAddresses: any = await db.getAllAsync('SELECT Email FROM User');
                console.log(emailAddresses.map((email: any) => email["Email"]));
                setEmailAddresses(emailAddresses.map((email: any) => email["Email"]));
            }
            catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    const signUp = async () => {
        if (!db)
            return;

        try {
            const result = await db.runAsync(`
                INSERT INTO User (FName, LName, Email, Password) VALUES ('${fName[0]}', '${lName[0]}', '${emailAddress[0]}', '${password[0]}');
            `);
            const userID: number = result.lastInsertRowId;
            await AsyncStorage.setItem('userID', userID.toString());
            router.push('/dashboard');
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <GestureHandlerRootView>
            <SafeAreaView style={{padding: 16, display: "flex", gap: 16}}>
                <Text style={{fontSize: 40}}>Sign Up</Text>
                <View style={{display: "flex", flexDirection: "column", gap: 16}}>
                    <TextField
                        value={fName[0]}
                        placeholder="First Name"
                        onChangeText={text => setFName([text, null])}
                        error={fName[1]}
                    />
                    <TextField
                        value={lName[0]}
                        placeholder="Last Name"
                        onChangeText={text => setLName([text, null])}
                        error={lName[1]}
                    />
                    <TextField
                        value={emailAddress[0]}
                        placeholder="Email Address"
                        onChangeText={(text: string) => {
                            let error = "";
                            const emailAddressRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
                            if (emailAddresses.findIndex(e => e === text) !== -1)
                                error = "Email address already exists. ";
                            if (!text.match(emailAddressRegex))
                                error += "Please enter a valid email address. "
                            setEmailAddress([text, error]);
                        }}
                        error={emailAddress[1]}
                    />
                    <TextField
                        value={password[0]}
                        placeholder="Password"
                        onChangeText={text => setPassword([text, null])}
                        error={password[1]}
                    />
                    <Pressable
                        onPress={async () => {
                            await signUp();
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
                        <Text style={{fontSize: 20, fontWeight: "medium", color: "white"}}>Sign Up</Text>
                    </Pressable>
                </View>
                <Pressable onPress={() => {router.push("/")}}>
                    <Text>Already have an account? Login.</Text>
                </Pressable>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}