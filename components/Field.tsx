// The first element is the value of the field,
// the second element is an error message for
// that field, if any.

import { CircleX } from "lucide-react-native";
import React, { ReactElement } from "react";
import { Text, View } from "react-native";

export type Field = [string, string | null];

interface FieldProps {
    input: ReactElement;
    error: string|null;
}

export default function Field(props: FieldProps) {
    return (
        <View style={{gap: 4}}>
            {props.input}
            {props.error &&
                <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 4}}>
                    <CircleX color="red" size={14}/>
                    <Text style={{fontSize: 14, color: "red"}}>{props.error}</Text>
                </View>
            }
        </View>
    )
}