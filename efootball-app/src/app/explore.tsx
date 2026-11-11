import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const events = [
  { game: 'PUBG MOBILE', name: 'Squad Championship', type: 'SQUAD • 4 PLAYERS', status: 'REGISTRATION SOON', date: 'Tarehe itatangazwa', color: '#B8F34A' },
  { game: 'EFOOTBALL', name: 'Mobile Champions Cup', type: '1 VS 1', status: 'COMING SOON', date: 'Tarehe itatangazwa', color: '#62B6FF' },
  { game: 'FREE FIRE', name: 'Booyah Battle', type: 'SOLO / SQUAD', status: 'COMING SOON', date: 'Tarehe itatangazwa', color: '#FFB454' },
];

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>COMPETE • CLIMB • WIN</Text>
      <Text style={styles.title}>Mashindano</Text>
      <Text style={styles.subtitle}>Chagua mchezo, angalia ratiba na jiandae kushindana.</Text>
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Ratiba na usajili</Text>
        <Text style={styles.noticeCopy}>Mashindano yataonekana hapa baada ya admin kuyachapisha. Tarehe, muda, idadi ya nafasi na zawadi vitaonyeshwa wazi.</Text>
      </View>
      {events.map((event) => (
        <View key={event.name} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={[styles.game, { color: event.color }]}>{event.game}</Text>
            <Text style={styles.status}>{event.status}</Text>
          </View>
          <Text style={styles.name}>{event.name}</Text>
          <Text style={styles.meta}>{event.type}  •  {event.date}</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
            <Text style={styles.buttonText}>Tengeneza akaunti kujiandaa</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080D16' },
  content: { padding: 20, paddingTop: 32, paddingBottom: 40 },
  kicker: { color: '#B8F34A', fontWeight: '800', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  title: { color: '#F4F7FC', fontSize: 29, fontWeight: '900' },
  subtitle: { color: '#91A0B6', lineHeight: 21, marginTop: 8, marginBottom: 20 },
  notice: { backgroundColor: '#182838', borderRadius: 14, borderWidth: 1, borderColor: '#30495C', padding: 15, marginBottom: 20 },
  noticeTitle: { color: '#B8F34A', fontWeight: '800', marginBottom: 6 },
  noticeCopy: { color: '#C0CBD7', fontSize: 12, lineHeight: 19 },
  card: { backgroundColor: '#111C29', borderRadius: 17, padding: 17, borderWidth: 1, borderColor: '#243545', marginBottom: 13 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  game: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  status: { color: '#91A0B6', fontSize: 9, fontWeight: '800' },
  name: { color: '#F4F7FC', fontSize: 18, fontWeight: '800', marginBottom: 7 },
  meta: { color: '#91A0B6', fontSize: 11, marginBottom: 15 },
  button: { borderWidth: 1, borderColor: '#53677B', borderRadius: 10, padding: 12, alignItems: 'center' },
  buttonText: { color: '#DCE6EF', fontSize: 12, fontWeight: '700' },
});
