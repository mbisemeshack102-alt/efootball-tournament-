import { ScrollView, StyleSheet, Text, View } from 'react-native';

const fixtures = [
  { round: 'MECHI 01', home: 'Mchezaji A', away: 'Mchezaji B', time: 'Muda utatangazwa' },
  { round: 'MECHI 02', home: 'Mchezaji C', away: 'Mchezaji D', time: 'Muda utatangazwa' },
  { round: 'MECHI 03', home: 'Mchezaji E', away: 'Mchezaji F', time: 'Muda utatangazwa' },
];

export default function TournamentScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>EFOOTBALL ARENA / MATCH CENTER</Text>
      <Text style={styles.title}>Ratiba ya Mechi</Text>
      <Text style={styles.subtitle}>Hapa ndipo ratiba, matokeo na hatua za mashindano zitaonekana.</Text>
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Hakuna mashindano yaliyochapishwa bado</Text>
        <Text style={styles.noticeText}>Hii ni sehemu ya majaribio. Msimamizi akishaunda mashindano na kuongeza wachezaji, ratiba itaonekana hapa.</Text>
      </View>
      <Text style={styles.section}>MFANO WA MPANGILIO WA MECHI</Text>
      {fixtures.map((match) => (
        <View key={match.round} style={styles.matchCard}>
          <Text style={styles.round}>{match.round}</Text>
          <View style={styles.teams}>
            <Text style={styles.team}>{match.home}</Text>
            <Text style={styles.vs}>VS</Text>
            <Text style={styles.team}>{match.away}</Text>
          </View>
          <Text style={styles.time}>{match.time}</Text>
        </View>
      ))}
      <Text style={styles.footer}>Matokeo ya mfano tu — si mechi halisi.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#07111f' },
  content: { padding: 22, paddingTop: 30, paddingBottom: 40, gap: 16 },
  kicker: { color: '#b7f34a', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: '#f4f7fb', fontSize: 28, fontWeight: '900' },
  subtitle: { color: '#91a2b7', fontSize: 13, lineHeight: 20 },
  notice: { backgroundColor: '#172b3c', borderColor: '#40513b', borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 8 },
  noticeTitle: { color: '#b7f34a', fontSize: 14, fontWeight: '800' },
  noticeText: { color: '#b4c2d0', fontSize: 12, lineHeight: 19, marginTop: 8 },
  section: { color: '#b9c7d5', fontSize: 10, fontWeight: '900', letterSpacing: 1.4, marginTop: 8 },
  matchCard: { backgroundColor: '#101f32', borderColor: '#20364d', borderWidth: 1, borderRadius: 15, padding: 16 },
  round: { color: '#b7f34a', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  teams: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  team: { color: '#f4f7fb', fontSize: 13, fontWeight: '800', flex: 1 },
  vs: { color: '#91a2b7', fontSize: 10, fontWeight: '900', paddingHorizontal: 12 },
  time: { color: '#91a2b7', fontSize: 10, marginTop: 12 },
  footer: { color: '#71849a', fontSize: 10, textAlign: 'center', marginTop: 6 },
});
