import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ButtonGroupProps {
    value: string;
    values: Array<[string, string]>;
    onValueChange: (value: string) => void;
}

export default function ButtonGroup(props: ButtonGroupProps) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                columnGap: 4,
                backgroundColor: "#E9E9E9",
                paddingVertical: 2,
                paddingHorizontal: 2,
                borderRadius: 12,
                height: "auto"
            }}
        >
            {props.values.map((value, i) => (
                <Pressable
                    key={i}
                    onPress={() => props.onValueChange(value[0])}
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 10,
                        backgroundColor: props.value === value[0] ? "#FFF" : "transparent",
                        boxShadow: props.value === value[0] ? "0px 1px 2px #00000020" : "",
                        width: "auto"
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16
                        }}
                    >{value[1]}</Text>
                </Pressable>
            ))}
        </View>
    )
}