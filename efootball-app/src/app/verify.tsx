import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function VerifyScreen() {
  const [code, setCode] = useState('');
  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>ACCOUNT SECURITY</Text>
      <Text style={styles.title}>Thibitisha email</Text>
      <Text style={styles.subtitle}>Weka verification code ya tarakimu 6 itakayotumwa kwenye email yako.</Text>
      <TextInput style={styles.input} placeholder="000000" placeholderTextColor="#7D8DA0" keyboardType="number-pad" maxLength={6} value={code} onChangeText={setCode} />
      <TouchableOpacity style={styles.primary} onPress={() => Alert.alert('Bado haijaunganishwa', 'OTP itathibitishwa kupitia Supabase baada ya kuweka credentials za mradi.')}><Text style={styles.primaryText}>THIBITISHA CODE</Text></TouchableOpacity>
      <Text style={styles.note}>Usimpe mtu mwingine verification code yako.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080D16', padding: 24, justifyContent: 'center' },
  kicker: { color: '#B8F34A', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  title: { color: '#F4F7FC', fontSize: 28, fontWeight: '900' },
  subtitle: { color: '#91A0B6', lineHeight: 21, marginTop: 8, marginBottom: 24 },
  input: { backgroundColor: '#111C29', borderWidth: 1, borderColor: '#2A3D4D', borderRadius: 12, padding: 17, color: '#FFFFFF', textAlign: 'center', fontSize: 22, letterSpacing: 8, marginBottom: 14 },
  primary: { backgroundColor: '#B8F34A', padding: 16, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#101A12', fontWeight: '900' },
  note: { color: '#75869B', textAlign: 'center', marginTop: 20, fontSize: 11 },
});
