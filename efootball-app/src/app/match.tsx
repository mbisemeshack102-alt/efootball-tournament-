import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function MatchScreen() {
  const [player, setPlayer] = useState({ x: 50, y: 73 });
  const [ball, setBall] = useState({ x: 50, y: 70 });
  const [score, setScore] = useState([0, 0]);
  const [seconds, setSeconds] = useState(0);
  const [sprinting, setSprinting] = useState(false);
  const [message, setMessage] = useState('MECHI INAENDELEA');
  const [possession, setPossession] = useState(true);
  const [difficulty, setDifficulty] = useState('Kawaida');
  const [finished, setFinished] = useState(false);
  const moveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    AsyncStorage.multiGet(['kwg.offline.player', 'kwg.offline.preferences']).then(([playerEntry, prefsEntry]) => {
      const name = playerEntry[1];
      if (prefsEntry[1]) {
        try { const prefs = JSON.parse(prefsEntry[1]); setDifficulty(prefs.difficulty || 'Kawaida'); } catch { /* ignore invalid local settings */ }
      }
      if (name) setMessage(`KARIBU ${name.toUpperCase()} • MECHI INAENDELEA`);
    });
    const clock = setInterval(() => setSeconds((s) => Math.min(90, s + 1)), 1000);
    aiTimer.current = setInterval(() => {
      setBall((b) => ({ x: clamp(b.x + (Math.random() - 0.5) * (difficulty === 'Ngumu' ? 5 : difficulty === 'Rahisi' ? 1.4 : 2.8), 8, 92), y: clamp(b.y - (difficulty === 'Ngumu' ? 1.2 : 0.65), 8, 92) }));
    }, 1800);
    return () => {
      clearInterval(clock);
      if (moveTimer.current) clearInterval(moveTimer.current);
      if (aiTimer.current) clearInterval(aiTimer.current);
    };
  }, [difficulty]);

  useEffect(() => {
    if (seconds < 90 || finished) return;
    setFinished(true);
    const saveResult = async () => {
      const raw = await AsyncStorage.getItem('kwg.offline.career');
      const old = raw ? JSON.parse(raw) : { club: 'KWG FC', coins: 1000, matches: 0, wins: 0, draws: 0, losses: 0, formation: '4-3-3', level: 1 };
      const won = score[0] > score[1];
      const drawn = score[0] === score[1];
      const next = { ...old, matches: (old.matches || 0) + 1, wins: (old.wins || 0) + (won ? 1 : 0), draws: (old.draws || 0) + (drawn ? 1 : 0), losses: (old.losses || 0) + (!won && !drawn ? 1 : 0), coins: (old.coins || 0) + (won ? 150 : drawn ? 75 : 25), level: Math.max(old.level || 1, Math.floor(((old.matches || 0) + 1) / 5) + 1) };
      await AsyncStorage.setItem('kwg.offline.career', JSON.stringify(next));
      setMessage(`MECHI IMEISHA • ${won ? 'USHINDI!' : drawn ? 'SARE' : 'JARIBU TENA'} • COINS +${won ? 150 : drawn ? 75 : 25}`);
    };
    saveResult();
  }, [seconds, finished, score]);

  const startMove = (dx: number, dy: number) => {
    if (moveTimer.current) clearInterval(moveTimer.current);
    const step = () => setPlayer((p) => {
      const speed = sprinting ? 2.2 : 0.9;
      const next = { x: clamp(p.x + dx * speed, 8, 92), y: clamp(p.y + dy * speed, 8, 92) };
      setBall((b) => {
        const close = Math.hypot(b.x - next.x, b.y - next.y) < 8;
        if (close) setPossession(true);
        return close ? { x: next.x + dx * 2, y: next.y + dy * 2 } : b;
      });
      return next;
    });
    step();
    moveTimer.current = setInterval(step, 75);
  };
  const stopMove = () => {
    if (moveTimer.current) clearInterval(moveTimer.current);
    moveTimer.current = null;
  };
  const shoot = () => {
    if (finished) return;
    if (!possession) { setMessage('KARIBIA KWANZA NA UCHUKUE MPIRA'); return; }
    if (player.y < 32 && player.x > 34 && player.x < 66) {
      setScore(([a, b]) => [a + 1, b]);
      setMessage('GOOOOOOL! UMEFUNGAAA!');
      setPlayer({ x: 50, y: 73 });
      setBall({ x: 50, y: 70 });
    } else {
      setBall({ x: clamp(player.x + (50 - player.x) * 0.45, 8, 92), y: 7 });
      setPossession(false);
      setMessage('SHUTI! ENDELEA KUSHAMBULIA');
    }
  };
  const pass = () => {
    if (finished) return;
    if (!possession) { setMessage('HAUNA MPIRA'); return; }
    setBall({ x: clamp(player.x + 13, 8, 92), y: clamp(player.y - 13, 8, 92) });
    setPossession(false);
    setMessage('PASI IMETOKA');
  };
  const tackle = () => {
    setPossession(true);
    setBall({ x: player.x, y: player.y });
    setMessage('UMENASA MPIRA!');
  };
  const reset = () => Alert.alert('Anza upya?', 'Utaanza mechi mpya.', [
    { text: 'Ghairi', style: 'cancel' },
    { text: 'Anza', onPress: () => { setScore([0, 0]); setSeconds(0); setFinished(false); setPlayer({ x: 50, y: 73 }); setBall({ x: 50, y: 70 }); setPossession(true); setMessage('MECHI INAENDELEA'); } },
  ]);
  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  const moveButton = (label: string, dx: number, dy: number) => (
    <Pressable onPressIn={() => startMove(dx, dy)} onPressOut={stopMove} style={styles.direction}><Text style={styles.directionText}>{label}</Text></Pressable>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ RUDI</Text></Pressable>
        <Text style={styles.heading}>KICKOFF MATCH</Text>
        <Pressable onPress={reset}><Text style={styles.back}>↻</Text></Pressable>
      </View>
      <View style={styles.scoreboard}>
        <Text style={styles.team}>KWG FC</Text>
        <Text style={styles.score}>{score[0]} - {score[1]}</Text>
        <Text style={styles.team}>CPU FC</Text>
      </View>
      <Text style={styles.clock}>{time} / 01:30  •  {difficulty.toUpperCase()} AI</Text>
      <Text style={styles.status}>{message}</Text>
      <View style={styles.pitch}>
        <View style={styles.halfLine} />
        <View style={styles.centerCircle} />
        <View style={styles.topBox} /><View style={styles.bottomBox} />
        <View style={styles.goalTop} /><View style={styles.goalBottom} />
        <Text style={[styles.player, { left: '18%', top: '23%' }]}>🔴</Text>
        <Text style={[styles.player, { left: '76%', top: '30%' }]}>🔴</Text>
        <Text style={[styles.player, { left: '29%', top: '48%' }]}>🔴</Text>
        <Text style={[styles.player, { left: '67%', top: '56%' }]}>🔴</Text>
        <Text style={[styles.player, { left: '48%', top: '13%' }]}>🧤</Text>
        <Text style={[styles.player, { left: `${player.x - 4}%`, top: `${player.y - 4}%` }]}>🔵</Text>
        <Text style={[styles.ball, { left: `${ball.x - 2}%`, top: `${ball.y - 2}%` }]}>⚽</Text>
        <Text style={styles.pitchLabel}>KICKOFF WINS GIFTS</Text>
      </View>
      <View style={styles.controls}>
        <View style={styles.pad}>
          <View style={styles.padRow}>{moveButton('▲', 0, -1)}</View>
          <View style={styles.padRow}>{moveButton('◀', -1, 0)}{moveButton('▼', 0, 1)}{moveButton('▶', 1, 0)}</View>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={pass} style={[styles.action, styles.pass]}><Text style={styles.actionText}>PASI</Text></Pressable>
          <Pressable onPress={shoot} style={[styles.action, styles.shoot]}><Text style={styles.actionText}>SHUTI</Text></Pressable>
          <Pressable onPress={tackle} style={[styles.action, styles.tackle]}><Text style={styles.actionText}>TACKLE</Text></Pressable>
          <Pressable onPressIn={() => setSprinting(true)} onPressOut={() => setSprinting(false)} style={[styles.action, styles.sprint, sprinting && styles.sprintOn]}><Text style={styles.actionText}>⚡ SPRINT</Text></Pressable>
        </View>
      </View>
      <Text style={styles.hint}>SHIKILIA mishale kusogeza mchezaji • Shikilia SPRINT kuongeza kasi • Dakika 1:30 za mechi</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#07111B', paddingHorizontal: 14, paddingTop: 8 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  back: { color: '#B9F34A', fontWeight: '900', fontSize: 15, padding: 8 },
  heading: { color: '#FFF', fontWeight: '900', letterSpacing: 1.4 },
  scoreboard: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#132535', borderRadius: 12, padding: 10 },
  team: { color: '#D9E4EF', fontWeight: '800', fontSize: 12 },
  score: { color: '#B9F34A', fontSize: 25, fontWeight: '900' },
  clock: { color: '#AFC0D0', textAlign: 'center', marginVertical: 7, fontWeight: '800' },
  status: { color: '#B9F34A', textAlign: 'center', fontSize: 11, fontWeight: '800', marginBottom: 7 },
  pitch: { flex: 1, minHeight: 300, maxHeight: 500, backgroundColor: '#167447', borderWidth: 3, borderColor: '#D8F1D9', borderRadius: 8, overflow: 'hidden', position: 'relative' },
  halfLine: { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: '#D8F1D9' },
  centerCircle: { position: 'absolute', width: 82, height: 82, borderRadius: 50, borderWidth: 1, borderColor: '#D8F1D9', left: '50%', top: '50%', marginLeft: -41, marginTop: -41 },
  topBox: { position: 'absolute', top: 0, left: '27%', width: '46%', height: '14%', borderWidth: 1, borderColor: '#D8F1D9', borderTopWidth: 0 },
  bottomBox: { position: 'absolute', bottom: 0, left: '27%', width: '46%', height: '14%', borderWidth: 1, borderColor: '#D8F1D9', borderBottomWidth: 0 },
  goalTop: { position: 'absolute', top: 0, left: '42%', width: '16%', height: 5, backgroundColor: '#F7F7F7' },
  goalBottom: { position: 'absolute', bottom: 0, left: '42%', width: '16%', height: 5, backgroundColor: '#F7F7F7' },
  player: { position: 'absolute', fontSize: 21 },
  ball: { position: 'absolute', fontSize: 19 },
  pitchLabel: { position: 'absolute', top: '49%', alignSelf: 'center', color: '#C3E7D0', opacity: 0.45, fontWeight: '900', letterSpacing: 2, fontSize: 10 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, paddingBottom: 5 },
  pad: { width: '46%', alignItems: 'center' },
  padRow: { flexDirection: 'row', justifyContent: 'center' },
  direction: { backgroundColor: '#20384A', borderColor: '#3C596E', borderWidth: 1, width: 43, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', margin: 2 },
  directionText: { color: '#FFF', fontWeight: '900', fontSize: 18 },
  actions: { width: '52%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 6 },
  action: { minWidth: '46%', paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#08121B', fontWeight: '900', fontSize: 11 },
  pass: { backgroundColor: '#C5D9EA' },
  shoot: { backgroundColor: '#B9F34A' },
  tackle: { backgroundColor: '#FFB45B' },
  sprint: { backgroundColor: '#F7D64B' },
  sprintOn: { backgroundColor: '#FF7A45', transform: [{ scale: 1.04 }] },
  hint: { color: '#91A3B5', textAlign: 'center', fontSize: 10, paddingVertical: 8 },
});
