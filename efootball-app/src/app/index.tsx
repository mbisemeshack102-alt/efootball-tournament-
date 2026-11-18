import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import SportsLogo from '@/components/sports-logo';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PLAYER_KEY = 'kwg.offline.player';

export default function HomeScreen() {
  const [playerName, setPlayerName] = useState('');
  const [draftName, setDraftName] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PLAYER_KEY)
      .then((saved) => {
        if (saved) {
          setPlayerName(saved);
          setDraftName(saved);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const savePlayer = async () => {
    const name = draftName.trim();
    if (!name) {
      Alert.alert('Weka jina', 'Andika jina lako ili kuanza kucheza.');
      return;
    }
    await AsyncStorage.setItem(PLAYER_KEY, name);
    setPlayerName(name);
    Alert.alert('Karibu!', `Karibu kwenye KICKOFF WINS GIFTS, ${name}.`);
  };

  const changePlayer = () => {
    setDraftName(playerName);
    setPlayerName('');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <SportsLogo size={58} />
          <View>
            <Text style={styles.eyebrow}>OFFLINE ARENA • TANZANIA</Text>
            <Text style={styles.brand}>KICKOFF <Text style={styles.accent}>WINS</Text></Text>
            <Text style={styles.brand}>GIFTS</Text>
          </View>
        </View>
        <View style={styles.offlineBadge}><Text style={styles.offlineText}>● OFFLINE</Text></View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.pill}>HAKUNA AKAUNTI • HAKUNA GMAIL • OFFLINE</Text>
        <Text style={styles.heroTitle}>Simamia mashindano yote.</Text>
        <Text style={styles.heroCopy}>Tengeneza mashindano ya Free Fire, PUBG Mobile, eFootball, Call of Duty na michezo mingine. Sajili washiriki, rekodi matokeo na fuatilia msimamo bila internet.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/explore')}>
          <Text style={styles.primaryText}>FUNGUA USIMAMIZI WA MASHINDANO →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Michezo inayopatikana</Text>
        <Text style={styles.sectionHint}>GAMES</Text>
      </View>
      {[
        { name: 'eFootball', detail: 'Ligi na mashindano', icon: '⚽' },
        { name: 'Free Fire', detail: 'Solo, Duo na Squad', icon: '🔥' },
        { name: 'PUBG Mobile', detail: 'Mashindano ya vikosi', icon: '🎯' },
        { name: 'Call of Duty Mobile', detail: 'Mashindano ya timu', icon: '🎮' },
      ].map((game) => (
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
        <Text style={styles.sectionHint}>KWENYE SIMU HII</Text>
      </View>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/explore')}>
          <Text style={styles.actionTitle}>🏆 Mashindano</Text>
          <Text style={styles.muted}>Simamia bila internet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/career')}>
          <Text style={styles.actionTitle}>👥 Washiriki & Timu</Text>
          <Text style={styles.muted}>Usajili na takwimu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/settings')}>
          <Text style={styles.actionTitle}>⚙️ Settings</Text>
          <Text style={styles.muted}>Mipangilio offline</Text>
        </TouchableOpacity>
      </View>
      {playerName ? (
        <TouchableOpacity onPress={changePlayer}><Text style={styles.changePlayer}>Badilisha jina la mchezaji</Text></TouchableOpacity>
      ) : null}
      <Text style={styles.footer}>KICK OFF • OFFLINE TOURNAMENT MANAGER</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080D16' },
  content: { padding: 20, paddingTop: 30, paddingBottom: 42 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  brandGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  eyebrow: { color: '#91A0B6', fontSize: 9, letterSpacing: 1.4, fontWeight: '700', marginBottom: 7 },
  brand: { color: '#F4F7FC', fontSize: 23, fontWeight: '900', letterSpacing: 1 },
  accent: { color: '#B8F34A' },
  offlineBadge: { backgroundColor: '#203B2A', paddingHorizontal: 9, paddingVertical: 7, borderRadius: 20 },
  offlineText: { color: '#B8F34A', fontSize: 9, fontWeight: '900' },
  hero: { backgroundColor: '#142331', borderRadius: 22, padding: 22, borderWidth: 1, borderColor: '#2A3D4D', marginBottom: 28 },
  pill: { alignSelf: 'flex-start', color: '#B8F34A', backgroundColor: '#253A2B', overflow: 'hidden', borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6, fontSize: 9, letterSpacing: 1, fontWeight: '800', marginBottom: 17 },
  heroTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', marginBottom: 8 },
  heroCopy: { color: '#B8C5D3', lineHeight: 21, fontSize: 14, marginBottom: 20 },
  input: { backgroundColor: '#0D1723', borderWidth: 1, borderColor: '#405468', borderRadius: 12, padding: 14, color: '#FFFFFF', marginBottom: 12 },
  primaryButton: { backgroundColor: '#B8F34A', borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  primaryText: { color: '#101A12', fontWeight: '900', letterSpacing: 0.7 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, marginTop: 4 },
  sectionTitle: { color: '#F4F7FC', fontSize: 18, fontWeight: '800' },
  sectionHint: { color: '#75869B', fontSize: 9, letterSpacing: 1.2, fontWeight: '800' },
  gameCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111C29', padding: 15, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: '#1F3040' },
  gameIcon: { fontSize: 26, marginRight: 14 },
  gameInfo: { flex: 1 },
  gameName: { color: '#F4F7FC', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  muted: { color: '#91A0B6', fontSize: 12 },
  arrow: { color: '#B8F34A', fontSize: 26 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '48%', backgroundColor: '#111C29', borderRadius: 14, borderWidth: 1, borderColor: '#1F3040', padding: 15, marginBottom: 10, minHeight: 88, justifyContent: 'center' },
  actionTitle: { color: '#F4F7FC', fontWeight: '800', fontSize: 14, marginBottom: 6 },
  changePlayer: { color: '#B8F34A', textAlign: 'center', marginTop: 14, fontWeight: '700' },
  footer: { color: '#586A7E', fontSize: 9, textAlign: 'center', letterSpacing: 1.1, marginTop: 22 },
});
