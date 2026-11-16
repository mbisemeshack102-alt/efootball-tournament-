import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const colors = { bg: '#07111f', panel: '#101f32', line: '#20364d', green: '#b7f34a', muted: '#91a2b7', white: '#f4f7fb' };

function ActionCard({ title, detail, onPress }: { title: string; detail: string; onPress: () => void }) {
  return (
    <TouchableOpacity accessibilityRole="button" onPress={onPress} style={styles.actionCard}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDetail}>{detail}</Text>
      <Text style={styles.actionArrow}>Fungua →</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>EFOOTBALL ARENA</Text>
          <Text style={styles.heading}>Cheza. Shindana.{"\n"}Kuwa Bingwa.</Text>
        </View>
        <View style={styles.livePill}><View style={styles.dot} /><Text style={styles.liveText}>ARENA</Text></View>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>KARIBU KWENYE UWANJA</Text>
        <Text style={styles.heroTitle}>Mashindano yako,{"\n"}kanuni zako.</Text>
        <Text style={styles.heroCopy}>Jiunge na mashindano ya eFootball, fuatilia ratiba na matokeo, kisha panda kwenye leaderboard.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/explore')}>
          <Text style={styles.primaryText}>ANGALIA MASHINDANO  →</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>KITUO CHA MASHINDANO</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}><Text style={styles.statValue}>—</Text><Text style={styles.statLabel}>Mashindano</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>—</Text><Text style={styles.statLabel}>Wachezaji</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>—</Text><Text style={styles.statLabel}>Mechi</Text></View>
      </View>
      <Text style={styles.sectionTitle}>ANZA HAPA</Text>
      <ActionCard title="Ratiba na Matokeo" detail="Angalia mechi, muda na matokeo." onPress={() => router.push('/explore')} />
      <ActionCard title="Ushiriki wa Wachezaji" detail="Jiandae kujiunga na mashindano." onPress={() => router.push('/explore')} />
      <Text style={styles.note}>Toleo la majaribio · Takwimu halisi zitaonekana baada ya kuunganishwa na hifadhidata.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 22, paddingTop: 30, paddingBottom: 40, gap: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kicker: { color: colors.green, fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  heading: { color: colors.white, fontSize: 29, fontWeight: '900', lineHeight: 35, marginTop: 10 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderColor: '#39523b', borderWidth: 1, borderRadius: 30, paddingHorizontal: 11, paddingVertical: 7 },
  dot: { width: 7, height: 7, borderRadius: 5, backgroundColor: colors.green },
  liveText: { color: colors.green, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  heroCard: { backgroundColor: '#162b3c', borderColor: '#315044', borderWidth: 1, borderRadius: 22, padding: 20, marginTop: 8 },
  heroLabel: { color: colors.green, fontSize: 10, fontWeight: '900', letterSpacing: 1.6 },
  heroTitle: { color: colors.white, fontSize: 27, fontWeight: '900', lineHeight: 33, marginTop: 12 },
  heroCopy: { color: '#b1c0ce', fontSize: 13, lineHeight: 20, marginTop: 10 },
  primaryButton: { backgroundColor: colors.green, borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 20 },
  primaryText: { color: '#14200d', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  sectionTitle: { color: '#b9c7d5', fontSize: 11, fontWeight: '900', letterSpacing: 1.4, marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: colors.panel, borderColor: colors.line, borderWidth: 1, borderRadius: 14, padding: 14 },
  statValue: { color: colors.green, fontSize: 23, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 10, marginTop: 5 },
  actionCard: { backgroundColor: colors.panel, borderColor: colors.line, borderWidth: 1, borderRadius: 15, padding: 16 },
  actionTitle: { color: colors.white, fontSize: 15, fontWeight: '800' },
  actionDetail: { color: colors.muted, fontSize: 12, marginTop: 5 },
  actionArrow: { color: colors.green, fontSize: 11, fontWeight: '800', marginTop: 12 },
  note: { color: '#71849a', fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 4 },
});
