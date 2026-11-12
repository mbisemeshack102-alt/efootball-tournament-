import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#B8F34A',
        tabBarInactiveTintColor: '#91A0B6',
        tabBarStyle: { backgroundColor: '#0D1723', borderTopColor: '#243545', borderTopWidth: 1 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Mwanzo', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏠</Text> }} />
      <Tabs.Screen name="explore" options={{ title: 'Mashindano', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏆</Text> }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
      <Tabs.Screen name="verify" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="updates" options={{ href: null }} />
      <Tabs.Screen name="chat" options={{ href: null }} />
    </Tabs>
  );
}
