import { X } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface BackButtonProps {
    onPress: () => void;
}

export default function BackButton(props: BackButtonProps) {
    return (
        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
            <Pressable onPress={props.onPress} style={{backgroundColor: "#ECECEC", width: 32, height: 32, borderRadius: 100, display: "flex", alignItems: "center", justifyContent: "center"}}>
                <X strokeWidth={2.5} color="#B4B4B4"/>
            </Pressable>
        </View>
    )
}