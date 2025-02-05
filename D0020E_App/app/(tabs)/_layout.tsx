import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      {<Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }} 
      />}
      {<Tabs.Screen
        name="(index)"
        options={{
          title: "Teams",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="male" color={color}/>
        }}
      />}
      <Tabs.Screen
        name="sek"
        options={{
          title: 'Sek',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="futbol-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
     
    </Tabs>
  );
}
