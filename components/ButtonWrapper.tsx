import { Text } from "react-native";
import { ButtonProps, Pressable } from "react-native";

interface ButtonWrapperProps extends ButtonProps {
    style?: any;
}

export default function ButtonWrapper(props: ButtonWrapperProps) {
    return (
        <Pressable
            onPress={props.onPress}
            style={{
                ...props.style,
                padding: 12,
                borderRadius: 6,
                backgroundColor: "#000",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
            }}
        >
            <Text style={{fontSize: 18, color: "white"}}>{props.title}</Text>
        </Pressable>
    )
}