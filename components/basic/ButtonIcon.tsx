import { X } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";

interface ButtonIconProps {
    onPress: () => void;
    children: React.ReactNode;
    style?: any;
}

export default function ButtonIcon(props: ButtonIconProps) {
    return (
        <Pressable onPress={props.onPress} style={{backgroundColor: "#ECECEC", width: 32, height: 32, borderRadius: 100, display: "flex", alignItems: "center", justifyContent: "center", ...props.style}}>
            {props.children}
        </Pressable>
    )
}