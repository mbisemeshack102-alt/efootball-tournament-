import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const notConnected = () => Alert.alert('Usajili unasubiri muunganisho', 'Fomu iko tayari. Tutawasha usajili na kutuma verification code kwa email baada ya kuunganisha Supabase.');
  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>CREATE PLAYER ACCOUNT</Text>
      <Text style={styles.title}>Jisajili</Text>
      <Text style={styles.subtitle}>Fungua akaunti moja kwa michezo yote.</Text>
      <TextInput style={styles.input} placeholder="Username / Game name" placeholderTextColor="#7D8DA0" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email address" placeholderTextColor="#7D8DA0" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password (angalau herufi 8)" placeholderTextColor="#7D8DA0" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.primary} onPress={notConnected}><Text style={styles.primaryText}>FUNGUA AKAUNTI</Text></TouchableOpacity>
      <Text style={styles.privacy}>Verification code itatumwa kwenye email yako baada ya backend kuunganishwa.</Text>
      <TouchableOpacity onPress={() => router.push('/login')}><Text style={styles.link}>Tayari una akaunti? Ingia</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080D16', padding: 24, justifyContent: 'center' },
  kicker: { color: '#B8F34A', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  title: { color: '#F4F7FC', fontSize: 30, fontWeight: '900' },
  subtitle: { color: '#91A0B6', marginTop: 7, marginBottom: 25 },
  input: { backgroundColor: '#111C29', borderWidth: 1, borderColor: '#2A3D4D', borderRadius: 12, padding: 15, color: '#FFFFFF', marginBottom: 13 },
  primary: { backgroundColor: '#B8F34A', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 5 },
  primaryText: { color: '#101A12', fontWeight: '900' },
  privacy: { color: '#75869B', textAlign: 'center', fontSize: 11, lineHeight: 18, marginTop: 18 },
  link: { color: '#B8F34A', textAlign: 'center', marginTop: 19, fontWeight: '700' },
});
