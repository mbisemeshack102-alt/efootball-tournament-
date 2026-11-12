import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function VerifyScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!supabase) {
      Alert.alert('Supabase haijawekwa', 'Weka credentials za Supabase kwenye .env kwanza.');
      return;
    }
    if (!email.trim() || code.trim().length !== 6) {
      Alert.alert('Taarifa hazijakamilika', 'Weka email na code ya tarakimu 6.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'signup' });
    setLoading(false);
    if (error) {
      Alert.alert('Code haijathibitishwa', error.message);
      return;
    }
    router.replace('/');
  };

  const resend = async () => {
    if (!supabase || !email.trim()) {
      Alert.alert('Weka email', 'Andika email uliyotumia kujisajili.');
      return;
    }
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
    Alert.alert(error ? 'Imeshindikana' : 'Imetumwa', error?.message ?? 'Verification code mpya imetumwa kwenye email yako.');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>ACCOUNT SECURITY</Text>
      <Text style={styles.title}>Thibitisha email</Text>
      <Text style={styles.subtitle}>Weka email na verification code ya tarakimu 6 iliyotumwa kwenye email yako.</Text>
      <TextInput style={styles.email} placeholder="Email address" placeholderTextColor="#7D8DA0" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="000000" placeholderTextColor="#7D8DA0" keyboardType="number-pad" maxLength={6} value={code} onChangeText={setCode} />
      <TouchableOpacity style={styles.primary} onPress={verify} disabled={loading}><Text style={styles.primaryText}>{loading ? 'INATHIBITISHA...' : 'THIBITISHA CODE'}</Text></TouchableOpacity>
      <TouchableOpacity onPress={resend}><Text style={styles.resend}>Tuma code nyingine</Text></TouchableOpacity>
      <Text style={styles.note}>Usimpe mtu mwingine verification code yako.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080D16', padding: 24, justifyContent: 'center' },
  kicker: { color: '#B8F34A', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  title: { color: '#F4F7FC', fontSize: 28, fontWeight: '900' },
  subtitle: { color: '#91A0B6', lineHeight: 21, marginTop: 8, marginBottom: 24 },
  email: { backgroundColor: '#111C29', borderWidth: 1, borderColor: '#2A3D4D', borderRadius: 12, padding: 15, color: '#FFFFFF', marginBottom: 12 },
  input: { backgroundColor: '#111C29', borderWidth: 1, borderColor: '#2A3D4D', borderRadius: 12, padding: 17, color: '#FFFFFF', textAlign: 'center', fontSize: 22, letterSpacing: 8, marginBottom: 14 },
  primary: { backgroundColor: '#B8F34A', padding: 16, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#101A12', fontWeight: '900' },
  resend: { color: '#B8F34A', textAlign: 'center', marginTop: 18, fontWeight: '700' },
  note: { color: '#75869B', textAlign: 'center', marginTop: 20, fontSize: 11 },
});
