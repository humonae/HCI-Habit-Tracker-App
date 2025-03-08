import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Button, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Trash2 } from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface DateTime {
    id: number;
    day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
    hour: string;
    minute: string;
    time: string;
}

interface DateTimeProps {
    open: boolean;
    initialValue: DateTime;
    onValueChange: (value: DateTime) => void;
    onOpen: (id: number) => void;
    onClose: () => void;
    onDelete: (id: number) => void;
}

// If you pass in "0", "00" will be returned.
// If you pass in "12", "12" will be returned.
// That is the point of this function, to format
// numbers for time representations.
function formatTime(time: string): string {
    if (time.length === 1)
        return "0" + time.toString();
    return time.toString();
}

export default function DateTimePicker(props: DateTimeProps) {
    const [day, setDay] = useState(props.initialValue.day);
    const [hour, setHour] = useState(props.initialValue.hour);
    const [minute, setMinute] = useState(props.initialValue.minute);
    const [time, setTime] = useState(props.initialValue.time);
    
    return (
        <View>
            {props.open &&
                <Modal
                    animationType="slide"
                    visible={true}
                    presentationStyle="overFullScreen"
                    transparent={true}
                >
                    <SafeAreaProvider style={{display: "flex", justifyContent: "flex-end"}}>
                        <SafeAreaView style={{paddingHorizontal: 32, display: "flex", rowGap: 24, backgroundColor: "white", justifyContent: "flex-end", borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: "0px 10px 10px 10px #00000010"}}>
                            <Text style={{fontSize: 32}}>Add Alarm</Text>
                            <View style={{
                                display: "flex",
                                rowGap: 12,
                            }}>
                                <View 
                                    style={style.picker}
                                >
                                    <Picker
                                        selectedValue={day}
                                        onValueChange={(itemValue) => setDay(itemValue)}
                                    >
                                        {DAYS.map((day, i) => (
                                            <Picker.Item
                                                key={i}
                                                value={day}
                                                label={day}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", columnGap: 4}}>
                                    <View style={{display: "flex", flexDirection: "row", alignItems: "center", columnGap: 4}}>
                                        <View 
                                            style={{...style.picker, width: 100}}
                                        >
                                            <Picker
                                                selectedValue={hour}
                                                onValueChange={(itemValue) => setHour(itemValue)}
                                            >
                                                {[...Array(12).keys()].map(i => i+1).map((hour, i) => (
                                                    <Picker.Item
                                                        key={i}
                                                        value={hour.toString()}
                                                        label={formatTime(hour.toString())}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                        <Text style={{fontSize: 48}}>:</Text>
                                        <View 
                                            style={{...style.picker, width: 100}}
                                        >
                                            <Picker
                                                selectedValue={minute}
                                                onValueChange={(itemValue) => setMinute(itemValue)}
                                            >
                                                {[...Array(60).keys()].map((minute, i) => (
                                                    <Picker.Item
                                                        key={i}
                                                        value={minute.toString()}
                                                        label={formatTime(minute.toString())}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                    <View 
                                        style={{...style.picker, width: 120}}
                                    >
                                        <Picker
                                            selectedValue={time}
                                            onValueChange={(itemValue) => setTime(itemValue)}
                                        >
                                            {["AM", "PM"].map((time, i) => (
                                                <Picker.Item
                                                    key={i}
                                                    value={time}
                                                    label={time}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                            <View style={{display: "flex", flexDirection: "column", rowGap: 12}}>
                                <Pressable
                                    onPress={props.onClose}
                                    style={{
                                        padding: 12,
                                        borderRadius: 6,
                                        borderWidth: 1,
                                        borderColor: "#F3F3F3",
                                        backgroundColor: "transparent",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center"
                                    }}
                                >
                                    <Text style={{fontSize: 18, color: "black"}}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => props.onValueChange({
                                        id: props.initialValue.id,
                                        day,
                                        time,
                                        hour,
                                        minute
                                    })}
                                    style={{
                                        padding: 12,
                                        borderRadius: 6,
                                        backgroundColor: "#000",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center"
                                    }}
                                >
                                    <Text style={{fontSize: 18, color: "white"}}>Save</Text>
                                </Pressable>
                            </View>
                        </SafeAreaView>
                    </SafeAreaProvider>
                </Modal>
            }
            {!props.open &&
                <View>
                    <Pressable
                        style={{backgroundColor: "#FFF", padding: 8, paddingLeft: 12, borderRadius: 12, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", boxShadow: "0px 1px 4px 0px #00000010", borderColor: "#E3E3E3", borderWidth: 1}}
                        onPress={() => props.onOpen(props.initialValue.id)}
                    >
                        <Text style={{fontSize: 18}}>{props.initialValue.day}, {formatTime(props.initialValue.hour)}:{formatTime(props.initialValue.minute)} {props.initialValue.time}</Text>
                        <Pressable
                            style={{
                                padding: 6,
                                borderRadius: 8,
                                backgroundColor: "#FF000020"
                            }}
                            onPress={() => props.onDelete(props.initialValue.id)}
                        >
                            <Trash2 color="red" size={24}/>
                        </Pressable>
                    </Pressable>
                </View>
            }
        </View>
    )
}

export const style = StyleSheet.create({
    picker: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#F3F3F3',
        borderRadius: 12,
        height: 100,
        padding: 6,
        overflow: 'hidden',
        justifyContent: 'center',
        display: 'flex',
    }
})