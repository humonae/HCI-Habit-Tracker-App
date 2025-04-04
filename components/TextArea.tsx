import { CircleX } from "lucide-react-native";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { BLUE, BORDER_COLOR, BORDER_RADIUS, BOX_SHADOW, BOX_SHADOW_MD } from "@/constants/design";
import { useState } from "react";
import Field from "./Field";
import { Keyboard, Button } from 'react-native';

interface TextAreaProps {
    value: string;
    height: number;
    placeholder: string;
    onChangeText: (value: string) => void;
    error: string|null;
}

export default function TextArea(props: TextAreaProps) {
    const [inFocus, setInFocus] = useState(false);

    return (
        <Field
            input={
                <TextInput
                    style={{
                        fontSize: 16, 
                        borderWidth: 1, 
                        borderRadius: 8, 
                        borderColor: props.error ? "red" : inFocus ? BLUE : BORDER_COLOR, 
                        boxShadow: BOX_SHADOW,
                        height: props.height,
                        padding: 16,
                        textAlignVertical: 'top'
                    }}
                    multiline={true}
                    placeholder={props.placeholder}
                    onChangeText={text => props.onChangeText(text)}
                    onFocus={() => setInFocus(true)}
                    onBlur={() => setInFocus(false)}
                    // 
                    blurOnSubmit={true}
                />
            }
            error={props.error}
        />
    )
}