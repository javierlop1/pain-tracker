import { Tabs } from 'expo-router';
import { Chrome as Home, History } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A6FA5',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        },
        headerStyle: {
          backgroundColor: '#4A6FA5',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pain Tracker',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          tabBarLabel: 'Log Pain',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <History color={color} size={24} />,
          tabBarLabel: 'History',
        }}
      />
    </Tabs>
  );
}