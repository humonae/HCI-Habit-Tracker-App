import { BLUE, BORDER_RADIUS, BOX_SHADOW_MD, BUTTON_BORDER_RADIUS } from "@/constants/design";
import React from "react";
import { Text, Pressable } from "react-native";

interface ButtonWrapperProps {
    onPress: () => void;
    style?: any;
    children: React.ReactNode;
}

export default function ButtonWrapper(props: ButtonWrapperProps) {
    return (
        <Pressable
            onPress={props.onPress}
            style={{
                padding: 12,
                boxShadow: BOX_SHADOW_MD,
                borderRadius: BUTTON_BORDER_RADIUS,
                backgroundColor: "black",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                ...props.style
            }}
        >
            {props.children}
        </Pressable>   
    )
}