import { Pressable, Text, View } from "react-native";

interface CheckboxProps {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export default function Checkbox(props: CheckboxProps) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: 8,
            }}
        >
            <Pressable
                style={{
                    width: 24,
                    height: 24,
                    padding: 2,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: props.value ? "#0F268C10" : "#00000010",
                    backgroundColor: props.value ? "#4169E1" : "transparent",
                    boxShadow: "0px 1px 1px 0px #00000010",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onPress={() => props.onValueChange(!props.value)}
            >
                {props.value &&
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#FFF"
                    }}>✓</Text>
                }
            </Pressable>
            <Text
                style={{
                    fontSize: 18
                }}
            >{props.label}</Text>
        </View>
    )
}