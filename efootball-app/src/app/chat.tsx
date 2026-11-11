import { StyleSheet, Text, View } from 'react-native';

export default function ChatScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>PLAYER COMMUNITY</Text>
      <Text style={styles.title}>Chat</Text>
      <View style={styles.empty}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.heading}>Maongezi ya mashindano</Text>
        <Text style={styles.copy}>Private messages, group chat za mashindano na matangazo ya admin zitaonekana hapa.</Text>
        <Text style={styles.status}>CHAT YA MOJA KWA MOJA ITAWASHWA BAADA YA DATABASE KUUNGANISHWA</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080D16', padding: 20, paddingTop: 32 },
  kicker: { color: '#B8F34A', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#F4F7FC', fontSize: 29, fontWeight: '900', marginTop: 8 },
  empty: { backgroundColor: '#111C29', borderColor: '#243545', borderWidth: 1, borderRadius: 18, padding: 22, marginTop: 24, alignItems: 'center' },
  icon: { fontSize: 34, marginBottom: 13 },
  heading: { color: '#F4F7FC', fontSize: 17, fontWeight: '800', marginBottom: 8 },
  copy: { color: '#91A0B6', fontSize: 12, textAlign: 'center', lineHeight: 19 },
  status: { color: '#B8F34A', fontSize: 9, fontWeight: '800', textAlign: 'center', letterSpacing: 1, lineHeight: 16, marginTop: 18 },
});
