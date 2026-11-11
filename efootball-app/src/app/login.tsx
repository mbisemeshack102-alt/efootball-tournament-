import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!supabase) {
      Alert.alert('Supabase haijawekwa', 'Weka Project URL na Publishable Key kwenye efootball-app/.env kisha anzisha app upya.');
      return;
    }
    if (!email.trim() || !password) {
      Alert.alert('Jaza taarifa', 'Weka email na password yako.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      Alert.alert('Imeshindikana kuingia', error.message);
      return;
    }
    router.replace('/');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>KICKOFF WINS GIFTS</Text>
      <Text style={styles.title}>Karibu tena</Text>
      <Text style={styles.subtitle}>Ingia kwenye akaunti yako ya mashindano.</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#7D8DA0" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#7D8DA0" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.primary} onPress={login} disabled={loading}><Text style={styles.primaryText}>{loading ? 'INAINGIA...' : 'INGIA'}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/verify')}><Text style={styles.link}>Nina verification code</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}><Text style={styles.link}>Huna akaunti? Jisajili</Text></TouchableOpacity>
      <Text style={styles.footnote}>Akaunti yako inalindwa na Supabase Authentication.</Text>
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
  link: { color: '#B8F34A', textAlign: 'center', marginTop: 19, fontWeight: '700' },
  footnote: { color: '#75869B', textAlign: 'center', fontSize: 11, lineHeight: 18, marginTop: 28 },
});
