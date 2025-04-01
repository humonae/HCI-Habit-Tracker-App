import ButtonGroup from "@/components/ButtonGroup";
import Checkbox from "@/components/Checkbox";
import DateTimePicker, { DateTime } from "@/components/DateTime";
import Toggle from "@/components/Toggle";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';
import TextField from "@/components/TextField";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { Field } from "./signup";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Index() {
    const router = useRouter();
    const [db, setDB] = useState<SQLite.SQLiteDatabase>();
    const [email, setEmail] = useState<Field>(["", null]);
    const [password, setPassword] = useState<Field>(["", null]);

    useEffect(() => {
        const load = async () => {    
            try {        
                const db = await SQLite.openDatabaseAsync('databaseName');      
                setDB(db);

                // I don't know the logins, so I'm looking at them here.
                const result: any = await db.getFirstAsync(`SELECT * FROM User;`);
                console.log(result);                
                if (!db)
                    return;
            }
            catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    const logIn = async () => {
        if (!db)
            return;

        try {
            const result: any = await db.getFirstAsync(`
                SELECT ID FROM User WHERE Email = '${email[0]}' AND Password = '${password[0]}';
            `);
            const userID: number = result["ID"];
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
                <Text style={{fontSize: 40}}>Log In</Text>
                <View style={{display: "flex", flexDirection: "column", gap: 16}}>
                    <TextField
                        value={email[0]}
                        placeholder="First Name"
                        onChangeText={text => setEmail([text, null])}
                        error={email[1]}
                    />
                    <TextField
                        value={password[0]}
                        placeholder="Last Name"
                        onChangeText={text => setPassword([text, null])}
                        error={password[1]}
                    />
                    <Pressable
                        onPress={async () => {
                            await logIn();
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
                        <Text style={{fontSize: 20, fontWeight: "medium", color: "white"}}>Log In</Text>
                    </Pressable>
                </View>
                <Pressable onPress={() => {router.push("/signup")}}>
                    <Text>Don't have an account yet? Create an account.</Text>
                </Pressable>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}