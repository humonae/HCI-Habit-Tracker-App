import { View, Text } from "react-native";

interface HabitProps {
    name: string;   
}

export default function Habit(props: HabitProps) {
    return (
        <View style={{
            padding: 12,
            backgroundColor: "white",
            width: "100%",
            borderRadius: 8,
            boxShadow: "0px 1px 4px 0px #00000010"
        }}>
            <Text style={{fontSize: 24, fontWeight: "400"}}>{props.name}</Text>
        </View>
    )
}