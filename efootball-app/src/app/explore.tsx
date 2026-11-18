import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const KEY = 'kickoff.offline.tournaments.v1';
const GAMES = [
  { name: 'Free Fire', icon: '🔥' }, { name: 'PUBG Mobile', icon: '🎯' },
  { name: 'eFootball', icon: '⚽' }, { name: 'Call of Duty Mobile', icon: '🎮' },
  { name: 'Mobile Legends', icon: '🛡️' }, { name: 'Michezo mingine', icon: '🏆' },
];
type Entrant = { id: string; name: string; played: number; wins: number; draws: number; losses: number; points: number; };
type Tournament = { id: string; name: string; game: string; format: string; date: string; entrants: Entrant[]; };
const makeId = () => Date.now().toString() + Math.random().toString(36).slice(2, 7);

export default function ExploreScreen() {
  const [items, setItems] = useState<Tournament[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [game, setGame] = useState('Free Fire');
  const [format, setFormat] = useState('Solo');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [entrantName, setEntrantName] = useState('');
  const [selected, setSelected] = useState('');
  const [scores, setScores] = useState<Record<string, string>>({});
  useEffect(() => { AsyncStorage.getItem(KEY).then(raw => { if (raw) setItems(JSON.parse(raw)); }).catch(() => Alert.alert('Hitilafu', 'Imeshindikana kusoma data za mashindano.')).finally(() => setLoaded(true)); }, []);
  const save = async (next: Tournament[]) => { setItems(next); await AsyncStorage.setItem(KEY, JSON.stringify(next)); };
  const active = items.find(t => t.id === selected);
  const create = async () => {
    if (!title.trim()) { Alert.alert('Jaza jina', 'Weka jina la mashindano kwanza.'); return; }
    const t: Tournament = { id: makeId(), name: title.trim(), game, format, date: date.trim() || 'Haijawekwa', entrants: [] };
    await save([t, ...items]); setSelected(t.id); setTitle(''); setDate('');
    Alert.alert('Imehifadhiwa', 'Mashindano mapya yameundwa kwenye simu hii.');
  };
  const addEntrant = async () => {
    if (!active || !entrantName.trim()) return;
    if (active.entrants.some(e => e.name.toLowerCase() === entrantName.trim().toLowerCase())) { Alert.alert('Jina lipo', 'Mshiriki huyu tayari ameandikishwa.'); return; }
    const next = items.map(t => t.id !== active.id ? t : { ...t, entrants: [...t.entrants, { id: makeId(), name: entrantName.trim(), played: 0, wins: 0, draws: 0, losses: 0, points: 0 }] });
    await save(next); setEntrantName('');
  };
  const recordResult = async (entrantId: string, delta: number) => {
    if (!active) return;
    if ((scores[entrantId] ?? '').trim() === '') { Alert.alert('Weka pointi', 'Andika pointi kabla ya kuhifadhi matokeo.'); return; }
    const value = Number(scores[entrantId]);
    if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) { Alert.alert('Matokeo si sahihi', 'Weka pointi au magoli kama namba kamili isiyo hasi.'); return; }
    const next = items.map(t => t.id !== active.id ? t : { ...t, entrants: t.entrants.map(e => e.id !== entrantId ? e : { ...e, played: e.played + 1, wins: e.wins + (delta === 3 ? 1 : 0), draws: e.draws + (delta === 1 ? 1 : 0), losses: e.losses + (delta === 0 ? 1 : 0), points: e.points + delta }) });
    await save(next); setScores(s => ({ ...s, [entrantId]: '' }));
  };
  const removeTournament = (id: string) => Alert.alert('Futa mashindano?', 'Taarifa zake zote kwenye simu hii zitafutwa.', [{ text: 'Ghairi', style: 'cancel' }, { text: 'Futa', style: 'destructive', onPress: async () => { await save(items.filter(t => t.id !== id)); if (selected === id) setSelected(''); } }]);
  const removeEntrant = (entrantId: string, name: string) => Alert.alert('Futa mshiriki?', `Unataka kumfuta ${name} kwenye mashindano haya?`, [{ text: 'Ghairi', style: 'cancel' }, { text: 'Futa', style: 'destructive', onPress: async () => { if (!active) return; await save(items.map(t => t.id !== active.id ? t : { ...t, entrants: t.entrants.filter(e => e.id !== entrantId) })); setScores(current => { const next = { ...current }; delete next[entrantId]; return next; }); } }]);
  const ranking = useMemo(() => [...(active?.entrants || [])].sort((a,b) => b.points-a.points || b.wins-a.wins || a.name.localeCompare(b.name)), [active]);
  if (!loaded) return <View style={s.screen}><Text style={s.muted}>Inapakia mashindano yaliyohifadhiwa...</Text></View>;
  return <ScrollView style={s.screen} contentContainerStyle={s.content}>
    <Text style={s.kicker}>KICK OFF • OFFLINE TOURNAMENT MANAGER</Text>
    <Text style={s.title}>Usimamizi wa mashindano</Text>
    <Text style={s.subtitle}>Tengeneza mashindano ya michezo mbalimbali, sajili washiriki, rekodi matokeo na fuatilia msimamo. Data inabaki kwenye simu hii.</Text>
    <View style={s.offline}><Text style={s.offlineText}>● OFFLINE — HAKUNA GMAIL, LOGIN AU INTERNET</Text></View>
    <Text style={s.section}>1. CHAGUA MCHEZO</Text>
    <View style={s.games}>{GAMES.map(g => <TouchableOpacity key={g.name} onPress={() => setGame(g.name)} style={[s.game, game===g.name && s.selected]}><Text style={s.gameIcon}>{g.icon}</Text><Text style={s.gameText}>{g.name}</Text></TouchableOpacity>)}</View>
    <Text style={s.section}>2. UNDA MASHINDANO</Text>
    <TextInput value={title} onChangeText={setTitle} placeholder="Jina la mashindano" placeholderTextColor="#8292A5" style={s.input}/>
    <View style={s.games}>{['Solo','Duo','Squad / Timu','1 vs 1','Ligi'].map(v => <TouchableOpacity key={v} onPress={() => setFormat(v)} style={[s.format, format===v && s.selected]}><Text style={s.gameText}>{v}</Text></TouchableOpacity>)}</View>
    <TextInput value={date} onChangeText={setDate} placeholder="Tarehe / muda (hiari)" placeholderTextColor="#8292A5" style={s.input}/>
    <TouchableOpacity style={s.primary} onPress={create}><Text style={s.primaryText}>+ UNDA MASHINDANO</Text></TouchableOpacity>
    <Text style={s.section}>3. MASHINDANO YALIYOHIFADHIWA ({items.length})</Text>
    {items.length===0 ? <Text style={s.empty}>Bado hakuna mashindano. Jaza taarifa hapo juu kisha bonyeza Unda Mashindano.</Text> : items.map(t => <View key={t.id} style={s.card}>
      <TouchableOpacity onPress={() => setSelected(t.id)}><Text style={s.gameCard}>{t.game} • {t.format}</Text><Text style={s.cardTitle}>{t.name}</Text><Text style={s.meta}>📅 {t.date}  •  👥 {t.entrants.length} washiriki</Text><Text style={s.link}>{selected===t.id?'INAANGALIWA ✓':'FUNGUA USIMAMIZI →'}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => removeTournament(t.id)}><Text style={s.delete}>FUTA MASHINDANO</Text></TouchableOpacity>
    </View>)}
    {active && <View style={s.panel}>
      <Text style={s.section}>USIMAMIZI: {active.name.toUpperCase()}</Text>
      <Text style={s.subhead}>Sajili mshiriki / timu</Text>
      <TextInput value={entrantName} onChangeText={setEntrantName} placeholder="Jina la mchezaji au timu" placeholderTextColor="#8292A5" style={s.input}/>
      <TouchableOpacity style={s.secondary} onPress={addEntrant}><Text style={s.primaryText}>+ SAJILI MSHIRIKI</Text></TouchableOpacity>
      <Text style={s.subhead}>Jedwali la msimamo</Text>
      <View style={s.tableHead}><Text style={[s.tableText,{flex:2}]}>Mshiriki</Text><Text style={s.tableText}>M</Text><Text style={s.tableText}>U</Text><Text style={s.tableText}>S</Text><Text style={s.tableText}>H</Text><Text style={s.tableText}>PT</Text></View>
      {ranking.map((e,i)=><View key={e.id} style={s.tableRow}><Text numberOfLines={1} style={[s.tableText,{flex:2}]}>{i+1}. {e.name}</Text><Text style={s.tableText}>{e.played}</Text><Text style={s.tableText}>{e.wins}</Text><Text style={s.tableText}>{e.draws}</Text><Text style={s.tableText}>{e.losses}</Text><Text style={[s.tableText,s.points]}>{e.points}</Text></View>)}
      {active.entrants.length===0 && <Text style={s.empty}>Washiriki wataonekana hapa baada ya kusajiliwa.</Text>}
      <Text style={s.subhead}>Rekodi matokeo / pointi</Text>
      <Text style={s.hint}>Kwa kila mshiriki, weka pointi alizopata kwenye raundi hii: ushindi = 3, sare = 1, kushindwa = 0. Kwa Battle Royale unaweza kuweka pointi za nafasi.</Text>
      {active.entrants.map(e=><View key={e.id} style={s.resultRow}><Text numberOfLines={1} style={s.resultName}>{e.name}</Text><TextInput keyboardType="number-pad" value={scores[e.id] || ''} onChangeText={v=>setScores(old=>({...old,[e.id]:v}))} placeholder="PT" placeholderTextColor="#8292A5" style={s.scoreInput}/><TouchableOpacity onPress={()=>recordResult(e.id, Number(scores[e.id]))} style={s.record}><Text style={s.recordText}>HIFADHI</Text></TouchableOpacity><TouchableOpacity onPress={()=>removeEntrant(e.id,e.name)} style={s.removeEntrant}><Text style={s.recordText}>FUTA</Text></TouchableOpacity></View>)}
      <TouchableOpacity onPress={()=>setSelected('')} style={s.close}><Text style={s.link}>FUNGA USIMAMIZI</Text></TouchableOpacity>
    </View>}
    <Text style={s.footer}>KICK OFF • MASHINDANO YAKO, USIMAMIZI WAKO</Text>
  </ScrollView>;
}
const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:'#080D16'},muted:{color:'#AAB8C7',padding:20},content:{padding:18,paddingTop:30,paddingBottom:50},kicker:{color:'#B8F34A',fontSize:9,fontWeight:'900',letterSpacing:1.5},title:{color:'#F4F7FC',fontSize:27,fontWeight:'900',marginTop:9},subtitle:{color:'#AAB8C7',fontSize:13,lineHeight:20,marginTop:8},offline:{backgroundColor:'#203B2A',padding:12,borderRadius:10,marginTop:16},offlineText:{color:'#B8F34A',fontWeight:'900',fontSize:10,textAlign:'center'},section:{color:'#B8F34A',fontSize:11,fontWeight:'900',letterSpacing:1.2,marginTop:25,marginBottom:11},games:{flexDirection:'row',flexWrap:'wrap',gap:8},game:{backgroundColor:'#111C29',borderRadius:10,padding:12,borderWidth:1,borderColor:'#243545',minWidth:95,alignItems:'center'},gameCard:{backgroundColor:'#111C29',borderRadius:11,padding:12,borderWidth:1,borderColor:'#243545',marginBottom:9},gameIcon:{fontSize:20,textAlign:'center'},gameText:{color:'#F4F7FC',fontSize:11,fontWeight:'800',textAlign:'center'},selected:{borderColor:'#B8F34A',backgroundColor:'#203B2A'},format:{backgroundColor:'#111C29',borderRadius:10,padding:11,borderWidth:1,borderColor:'#243545'},input:{backgroundColor:'#111C29',borderWidth:1,borderColor:'#304354',borderRadius:11,padding:14,color:'#FFF',marginBottom:10,marginTop:5},primary:{backgroundColor:'#B8F34A',padding:15,borderRadius:11,alignItems:'center',marginTop:4},primaryText:{color:'#101A12',fontWeight:'900',fontSize:12},secondary:{backgroundColor:'#B8F34A',padding:13,borderRadius:10,alignItems:'center'},empty:{color:'#91A0B6',backgroundColor:'#111C29',padding:15,borderRadius:11,lineHeight:19,fontSize:12},card:{backgroundColor:'#111C29',borderColor:'#243545',borderWidth:1,borderRadius:14,padding:15,marginBottom:10},cardTitle:{color:'#FFF',fontSize:17,fontWeight:'900',marginTop:7},meta:{color:'#91A0B6',fontSize:11,marginTop:7},link:{color:'#B8F34A',fontSize:11,fontWeight:'900',marginTop:12},gameLabel:{color:'#B8F34A',fontSize:10,fontWeight:'900'},delete:{color:'#FF9B9B',fontSize:10,fontWeight:'900',marginTop:12},panel:{backgroundColor:'#142331',borderRadius:15,borderWidth:1,borderColor:'#38533B',padding:14,marginTop:12},subhead:{color:'#FFF',fontSize:14,fontWeight:'900',marginTop:15,marginBottom:6},tableHead:{flexDirection:'row',backgroundColor:'#203B2A',padding:8,borderRadius:7,marginTop:8},tableRow:{flexDirection:'row',paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#304354'},tableText:{color:'#E7EEF5',fontSize:10,flex:1,textAlign:'center'},points:{color:'#B8F34A',fontWeight:'900'},hint:{color:'#AAB8C7',fontSize:11,lineHeight:17,marginBottom:8},resultRow:{flexDirection:'row',alignItems:'center',gap:7,marginTop:7},resultName:{color:'#FFF',fontSize:11,flex:1},scoreInput:{width:54,backgroundColor:'#080D16',borderRadius:7,padding:8,color:'#FFF',textAlign:'center'},record:{backgroundColor:'#263B4C',padding:10,borderRadius:7},removeEntrant:{backgroundColor:'#71343A',padding:10,borderRadius:7},recordText:{color:'#FFF',fontSize:9,fontWeight:'900'},close:{alignItems:'center',padding:12,marginTop:5},sub:{color:'#AAB8C7'},footer:{color:'#718398',fontSize:9,textAlign:'center',marginTop:25}
});
