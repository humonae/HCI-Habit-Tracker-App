import { HORIZONTAL_PADDING, RED_1, RED_2, VERTICAL_PADDING } from "@/constants/design";
import { CircleX } from "lucide-react-native";
import { Text, View } from "react-native";

interface ErrorMessageProps {
    error: string;
}

export default function ErrorMessage(props: ErrorMessageProps) {
    return (
        <View style={{backgroundColor: RED_1, paddingVertical: VERTICAL_PADDING * 1.5, paddingHorizontal: HORIZONTAL_PADDING, display: "flex", flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 9, borderWidth: 1, borderColor: "#d63024", height: "auto"}}>
            <View style={{height: "100%"}}>
                <CircleX size={16} color={RED_2}/>
            </View>
            <Text style={{fontSize: 14, color: RED_2, fontWeight: 400, top: -1, flex: 1}}>{props.error}</Text>
        </View>
    )
}