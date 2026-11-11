import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const games = [
  { name: 'PUBG Mobile', detail: 'Battle Royale tournaments', icon: '🎯' },
  { name: 'eFootball', detail: 'Football competitions', icon: '⚽' },
  { name: 'Free Fire', detail: 'Squad and solo events', icon: '🔥' },
];

function ActionCard({ title, detail, onPress }: { title: string; detail: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.82}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.muted}>{detail}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>MOBILE ESPORTS • TANZANIA</Text>
          <Text style={styles.brand}>KICKOFF <Text style={styles.accent}>WINS</Text></Text>
          <Text style={styles.brand}>GIFTS</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/settings')}>
          <Text style={styles.avatarText}>KW</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.pill}>YOUR GAME. YOUR ARENA.</Text>
        <Text style={styles.heroTitle}>Cheza. Shindana. Shinda.</Text>
        <Text style={styles.heroCopy}>Jukwaa moja la mashindano ya michezo mbalimbali ya simu.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/register')}>
          <Text style={styles.primaryText}>JIUNGE SASA  →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}>Tayari una akaunti? Ingia</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Michezo inayopatikana</Text>
        <Text style={styles.sectionHint}>GAMES</Text>
      </View>
      {games.map((game) => (
        <TouchableOpacity key={game.name} style={styles.gameCard} onPress={() => router.push('/explore')}>
          <Text style={styles.gameIcon}>{game.icon}</Text>
          <View style={styles.gameInfo}>
            <Text style={styles.gameName}>{game.name}</Text>
            <Text style={styles.muted}>{game.detail}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Kituo chako</Text>
        <Text style={styles.sectionHint}>QUICK ACCESS</Text>
      </View>
      <View style={styles.grid}>
        <ActionCard title="Mashindano" detail="Jiunge na mechi" onPress={() => router.push('/explore')} />
        <ActionCard title="Updates" detail="Habari na ratiba" onPress={() => router.push('/updates')} />
        <ActionCard title="Chat" detail="Ongea na wachezaji" onPress={() => router.push('/chat')} />
        <ActionCard title="Settings" detail="Dhibiti akaunti" onPress={() => router.push('/settings')} />
      </View>
      <Text style={styles.footer}>KICKOFF WINS GIFTS  •  BETA FOUNDATION</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080D16' },
  content: { padding: 20, paddingTop: 30, paddingBottom: 42 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  eyebrow: { color: '#91A0B6', fontSize: 10, letterSpacing: 2, fontWeight: '700', marginBottom: 7 },
  brand: { color: '#F4F7FC', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  accent: { color: '#B8F34A' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1B2A35', borderWidth: 1, borderColor: '#B8F34A', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#B8F34A', fontWeight: '900' },
  hero: { backgroundColor: '#142331', borderRadius: 22, padding: 22, borderWidth: 1, borderColor: '#2A3D4D', marginBottom: 28 },
  pill: { alignSelf: 'flex-start', color: '#B8F34A', backgroundColor: '#253A2B', overflow: 'hidden', borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6, fontSize: 9, letterSpacing: 1.4, fontWeight: '800', marginBottom: 17 },
  heroTitle: { color: '#FFFFFF', fontSize: 27, fontWeight: '900', marginBottom: 8 },
  heroCopy: { color: '#B8C5D3', lineHeight: 21, fontSize: 14, marginBottom: 20 },
  primaryButton: { backgroundColor: '#B8F34A', borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  primaryText: { color: '#101A12', fontWeight: '900', letterSpacing: 1 },
  loginLink: { color: '#D6E3EF', textAlign: 'center', marginTop: 15, fontWeight: '600' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  sectionTitle: { color: '#F4F7FC', fontSize: 18, fontWeight: '800' },
  sectionHint: { color: '#75869B', fontSize: 9, letterSpacing: 1.5, fontWeight: '800' },
  gameCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111C29', padding: 15, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: '#1F3040' },
  gameIcon: { fontSize: 26, marginRight: 14 },
  gameInfo: { flex: 1 },
  gameName: { color: '#F4F7FC', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  muted: { color: '#91A0B6', fontSize: 12 },
  arrow: { color: '#B8F34A', fontSize: 26 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '48%', backgroundColor: '#111C29', borderRadius: 14, borderWidth: 1, borderColor: '#1F3040', padding: 15, marginBottom: 10, minHeight: 88, justifyContent: 'center' },
  actionTitle: { color: '#F4F7FC', fontWeight: '800', fontSize: 14, marginBottom: 6 },
  footer: { color: '#586A7E', fontSize: 9, textAlign: 'center', letterSpacing: 1.3, marginTop: 22 },
});
