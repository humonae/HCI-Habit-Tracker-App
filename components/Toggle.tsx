import { Switch, Text, View } from "react-native";

interface ToggleProps {
    label: string;
    value: boolean;
    values: Array<[boolean, string]>;
    onValueChange: (value: boolean) => void;
}

export default function Toggle(props: ToggleProps) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                columnGap: 12
            }}
        >
            <Text
                style={{
                    fontSize: 18
                }}
            >{props.label}</Text>
            <Switch
                value={props.value}
                onValueChange={props.onValueChange}
            />
        </View>
    )
}