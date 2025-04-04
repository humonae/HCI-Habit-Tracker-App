import { CircleX } from "lucide-react-native";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { BLUE, BORDER_COLOR, BORDER_RADIUS, BOX_SHADOW, BOX_SHADOW_MD } from "@/constants/design";
import { useState } from "react";

interface TextFieldProps {
    value: string;
    placeholder: string;
    onChangeText: (value: string) => void;
    error: string|null;
}

export default function TextField(props: TextFieldProps) {
    const [inFocus, setInFocus] = useState(false);

    return (
        <View style={{gap: 4}}>
            <TextInput
                style={{
                    height: 52, 
                    padding: 16, 
                    fontSize: 16, 
                    borderWidth: 1, 
                    borderRadius: BORDER_RADIUS, 
                    borderColor: props.error ? "red" : inFocus ? BLUE : BORDER_COLOR, 
                    boxShadow: BOX_SHADOW_MD,
                }}
                placeholderTextColor={"gray"}
                placeholder={props.placeholder}
                onChangeText={text => props.onChangeText(text)}
                onFocus={() => setInFocus(true)}
                onBlur={() => setInFocus(false)}
            />
            {props.error &&
                <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 4}}>
                    <CircleX color="red" size={14}/>
                    <Text style={{fontSize: 14, color: "red"}}>{props.error}</Text>
                </View>
            }
        </View>
    )
}