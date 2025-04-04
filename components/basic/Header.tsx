import { Text, View } from "react-native";

interface HeaderProps {
    title: string;
    paragraph: string;
}

export default function Header(props: HeaderProps) {
    return (
        <View style={{display: "flex", gap: 4}}>
            <Text style={{fontSize: 36, fontWeight: 500, letterSpacing: -0.5}}>
                {props.title}
            </Text>
            {props.paragraph &&
                <Text style={{fontSize: 16, fontWeight: 400, color: "gray"}}>
                    {props.paragraph}
                </Text>
            }
        </View>
    )
}