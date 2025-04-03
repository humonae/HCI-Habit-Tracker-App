import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";

interface HabitProps {
    id: number;
    name: string;   
}

export default function Habit(props: HabitProps) {
    const router = useRouter();

    useEffect(() => {
        console.log(props);
    }, []);

    return (
        <View style={{
            padding: 12,
            backgroundColor: "white",
            width: "100%",
            borderRadius: 8,
            boxShadow: "0px 1px 4px 0px #00000010"
        }}>
            <Text>{props.id}</Text>
            <Pressable 
                style={{
                    backgroundColor: "blue"
                }}
                onPress={() => {
                    router.push({ pathname: '/addNote', params: { habitID: props.id } });
                    return null;
                }}
            >
                <Text>Log Note</Text>
            </Pressable>
            <Pressable 
                style={{
                    backgroundColor: "blue"
                }}
                onPress={() => {
                    router.push({ pathname: '/calendar', params: { habitID: props.id } });
                    return null;
                }}
            >
                <Text>Calendar</Text>
            </Pressable>
            <Text style={{fontSize: 24, fontWeight: "400"}}>{props.name}</Text>
        </View>
    )
}