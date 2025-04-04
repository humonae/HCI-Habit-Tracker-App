import { BLUE, BORDER_RADIUS, BOX_SHADOW_MD, BUTTON_BORDER_RADIUS } from "@/constants/design";
import { Text, Pressable, StyleSheet } from "react-native";
import ButtonWrapper from "./ButtonWrapper";

interface ButtonProps {
    label: string;
    onPress: () => void;
    style?: any;
}

export const BUTTON_LABEL_STYLE: any = {
    fontSize: 20, 
    fontWeight: 500, 
    color: "white"
}

export default function Button(props: ButtonProps) {
    return ( 
        <ButtonWrapper style={props.style} onPress={props.onPress}>
            <Text style={BUTTON_LABEL_STYLE}>{props.label}</Text>
        </ButtonWrapper>

    )
}