import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const PREFS = 'kwg.offline.preferences';
export default function SettingsScreen() {
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [difficulty, setDifficulty] = useState('Kawaida');
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(PREFS).then((raw) => {
      if (raw) {
        const p = JSON.parse(raw);
        setSound(p.sound ?? true); setVibration(p.vibration ?? true); setDifficulty(p.difficulty ?? 'Kawaida');
      }
    }).finally(() => setLoaded(true));
  }, []);
  const save = async (next: any) => {
    const value = { sound, vibration, difficulty, ...next };
    await AsyncStorage.setItem(PREFS, JSON.stringify(value));
  };
  const reset = () => Alert.alert('Futa data za mchezo?', 'Jina, career na takwimu za ndani zitafutwa kwenye simu hii.', [
    { text: 'Ghairi', style: 'cancel' },
    { text: 'Futa', style: 'destructive', onPress: async () => {
      await AsyncStorage.multiRemove(['kwg.offline.player', 'kwg.offline.career', 'kwg.offline.preferences']);
      setSound(true); setVibration(true); setDifficulty('Kawaida');
      Alert.alert('Imekamilika', 'Data za ndani zimefutwa.');
    }},
  ]);
  if (!loaded) return <View style={s.screen}><Text style={s.text}>Inapakia mipangilio...</Text></View>;
  return <ScrollView style={s.screen} contentContainerStyle={s.content}>
    <Text style={s.kicker}>OFFLINE PLAYER CONTROL</Text><Text style={s.title}>Mipangilio</Text>
    <Text style={s.sub}>Mchezo unafanya kazi bila akaunti, Gmail au internet.</Text>
    <Text style={s.section}>UDHIBITI WA MCHEZO</Text>
    <View style={s.row}><View style={s.info}><Text style={s.text}>Sauti za mchezo</Text><Text style={s.muted}>Washa au zima sauti</Text></View><Switch value={sound} onValueChange={(v) => {setSound(v); save({sound:v});}} /></View>
    <View style={s.row}><View style={s.info}><Text style={s.text}>Vibration</Text><Text style={s.muted}>Mtetemo wakati wa vitendo</Text></View><Switch value={vibration} onValueChange={(v) => {setVibration(v); save({vibration:v});}} /></View>
    <Text style={s.section}>UGUMU WA AI</Text>
    {['Rahisi','Kawaida','Ngumu'].map((v) => <TouchableOpacity key={v} onPress={() => {setDifficulty(v); save({difficulty:v});}} style={[s.choice, difficulty===v && s.selected]}><Text style={s.text}>{difficulty===v?'●  ':''}{v}</Text></TouchableOpacity>)}
    <Text style={s.section}>HIFADHI NA FARAGHA</Text>
    <View style={s.card}><Text style={s.text}>Hifadhi ya ndani ya simu</Text><Text style={s.muted}>Jina, maendeleo ya career, sarafu na takwimu huhifadhiwa kwenye kifaa hiki pekee.</Text></View>
    <TouchableOpacity onPress={reset} style={s.delete}><Text style={s.deleteText}>FUTA DATA ZOTE ZA MCHEZO</Text></TouchableOpacity>
    <Text style={s.footer}>KICKOFF WINS GIFTS • OFFLINE EDITION</Text>
  </ScrollView>;
}
const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:'#080D16'},content:{padding:20,paddingTop:34,paddingBottom:44},kicker:{color:'#B8F34A',fontSize:10,fontWeight:'900',letterSpacing:2},title:{color:'#F4F7FC',fontSize:30,fontWeight:'900',marginTop:8},sub:{color:'#91A0B6',marginTop:8,lineHeight:21},section:{color:'#B8F34A',fontSize:10,fontWeight:'900',letterSpacing:1.5,marginTop:25,marginBottom:10},row:{backgroundColor:'#111C29',borderColor:'#243545',borderWidth:1,borderRadius:13,padding:15,marginBottom:9,flexDirection:'row',alignItems:'center'},info:{flex:1},text:{color:'#F4F7FC',fontWeight:'800'},muted:{color:'#91A0B6',fontSize:12,marginTop:5,lineHeight:18},choice:{padding:15,backgroundColor:'#111C29',borderRadius:11,marginBottom:8,borderWidth:1,borderColor:'#243545'},selected:{borderColor:'#B8F34A',backgroundColor:'#1A2A20'},card:{padding:16,backgroundColor:'#111C29',borderRadius:13,borderWidth:1,borderColor:'#243545'},delete:{backgroundColor:'#57252A',padding:16,borderRadius:12,alignItems:'center',marginTop:25},deleteText:{color:'#FFD9DC',fontWeight:'900',fontSize:12},footer:{color:'#65768A',fontSize:10,textAlign:'center',marginTop:28}
});
