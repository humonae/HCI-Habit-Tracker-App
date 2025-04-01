import { CircleX } from "lucide-react-native";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface TextFieldProps {
    value: string;
    placeholder: string;
    onChangeText: (value: string) => void;
    error: string|null;
}

export default function TextField(props: TextFieldProps) {
    return (
        <View>
            <TextInput
                style={{height: 60, padding: 16, fontSize: 16, borderWidth: 1, borderRadius: 8, borderColor: "gray"}}
                placeholder={props.placeholder}
                onChangeText={text => props.onChangeText(text)}
            />
            {props.error &&
                <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 4}}>
                    <CircleX color="red"/>
                    <Text style={{fontSize: 18, color: "red"}}>{props.error}</Text>
                </View>
            }
        </View>
    )
}