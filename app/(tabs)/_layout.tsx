import { BLUE } from '@/constants/design';
import { Tabs } from 'expo-router';
import { CirclePlus, LayoutGrid } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false, headerStyle: {display: "none"}}}>
      <Tabs.Screen
        name="dashboard"
    
        options={{
          title: 'Dashboard',
          tabBarActiveTintColor: BLUE,
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ color }) => <LayoutGrid color={color}/>,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 500,
            marginTop: 2,
            marginBottom: 10,
          },
        }}
      />
      <Tabs.Screen
        name="addHabit"
        options={{
          title: 'Add Habits',
          tabBarActiveTintColor: BLUE,
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ color }) => <CirclePlus color={color}/>,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 500,
            marginTop: 2,
            marginBottom: 10,
          },
        }}
      />
    </Tabs>
  );
}