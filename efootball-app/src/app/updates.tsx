import { ScrollView, StyleSheet, Text, View } from 'react-native';

const items = [
  { tag: 'SYSTEM', title: 'Karibu KICKOFF WINS GIFTS', body: 'Jukwaa linaandaliwa kwa mashindano ya michezo mbalimbali ya simu.', time: 'Taarifa ya mfumo' },
  { tag: 'TOURNAMENTS', title: 'Ratiba zitakuwa hapa', body: 'Tarehe, muda wa kuanza, nafasi zilizobaki na zawadi zitaonekana kwenye ukurasa huu.', time: 'Updates' },
  { tag: 'SECURITY', title: 'Linda akaunti yako', body: 'Usishiriki password au verification code na mtu yeyote.', time: 'Usalama' },
];

export default function UpdatesScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>NEWSROOM</Text>
      <Text style={styles.title}>Updates</Text>
      <Text style={styles.subtitle}>Matangazo, mabadiliko ya ratiba na matokeo ya mashindano.</Text>
      {items.map((item) => (
        <View key={item.title} style={styles.card}>
          <Text style={styles.tag}>{item.tag}</Text>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      ))}
      <Text style={styles.hint}>Taarifa za moja kwa moja na push notifications zitawashwa baada ya kuunganisha backend.</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080D16' },
  content: { padding: 20, paddingTop: 32 },
  kicker: { color: '#B8F34A', fontWeight: '900', fontSize: 10, letterSpacing: 2 },
  title: { color: '#F4F7FC', fontSize: 29, fontWeight: '900', marginTop: 8 },
  subtitle: { color: '#91A0B6', lineHeight: 21, marginTop: 7, marginBottom: 20 },
  card: { backgroundColor: '#111C29', borderWidth: 1, borderColor: '#243545', borderRadius: 15, padding: 17, marginBottom: 12 },
  tag: { color: '#B8F34A', fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 9 },
  name: { color: '#F4F7FC', fontSize: 16, fontWeight: '800', marginBottom: 7 },
  body: { color: '#B3C0CE', fontSize: 12, lineHeight: 19 },
  time: { color: '#6F8297', fontSize: 10, marginTop: 13 },
  hint: { color: '#75869B', fontSize: 11, lineHeight: 18, textAlign: 'center', marginTop: 8 },
});
