import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const KEY='kwg.offline.career';
export default function CareerScreen(){
 const [data,setData]=useState({club:'KWG FC',coins:1000,matches:0,wins:0,draws:0,losses:0,formation:'4-3-3',level:1});
 useEffect(()=>{AsyncStorage.getItem(KEY).then(v=>{if(v)setData({...data,...JSON.parse(v)});});},[]);
 const choose=(formation:string)=>{const next={...data,formation};setData(next);AsyncStorage.setItem(KEY,JSON.stringify(next));};
 return <ScrollView style={s.screen} contentContainerStyle={s.content}>
  <Text style={s.kicker}>OFFLINE CAREER MODE</Text><Text style={s.title}>Klabu yangu</Text>
  <View style={s.club}><Text style={s.crest}>⚽</Text><Text style={s.clubName}>{data.club}</Text><Text style={s.muted}>LEVEL {data.level} • SEASON 1</Text><Text style={s.coins}>🪙 {data.coins} COINS</Text></View>
  <Text style={s.section}>TAKWIMU ZA MSIMU</Text><View style={s.stats}>
   {[[data.matches,'Mechi'],[data.wins,'Ushindi'],[data.draws,'Sare'],[data.losses,'Vipigo']].map(([v,l])=><View style={s.stat} key={String(l)}><Text style={s.statNum}>{v}</Text><Text style={s.muted}>{l}</Text></View>)}
  </View>
  <Text style={s.section}>MPANGILIO WA TIMU</Text><Text style={s.muted}>Chagua mfumo wa timu yako. Mabadiliko yanahifadhiwa kwenye simu.</Text>
  <View style={s.formations}>{['4-3-3','4-4-2','3-5-2','4-2-3-1'].map(f=><TouchableOpacity key={f} onPress={()=>choose(f)} style={[s.formation,data.formation===f&&s.active]}><Text style={s.formText}>{f}{data.formation===f?' ✓':''}</Text></TouchableOpacity>)}</View>
  <Text style={s.section}>NJIA ZA KUCHEZA</Text>
  <TouchableOpacity style={s.action} onPress={()=>router.push('/match')}><Text style={s.actionTitle}>⚽ Mechi ya kirafiki</Text><Text style={s.muted}>Cheza dhidi ya AI bila internet</Text></TouchableOpacity>
  <TouchableOpacity style={s.action} onPress={()=>router.push('/explore')}><Text style={s.actionTitle}>🏆 Kombe na ligi</Text><Text style={s.muted}>Mashindano ya ndani ya mchezo</Text></TouchableOpacity>
  <Text style={s.note}>Maendeleo ya career yanahifadhiwa ndani ya kifaa. Takwimu za mechi zitaongezwa kiotomatiki baada ya mfumo wa matokeo kukamilishwa.</Text>
 </ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:'#080D16'},content:{padding:20,paddingTop:34,paddingBottom:45},kicker:{color:'#B8F34A',fontSize:10,fontWeight:'900',letterSpacing:2},title:{color:'#F4F7FC',fontSize:30,fontWeight:'900',marginTop:8},club:{backgroundColor:'#142331',borderColor:'#38533B',borderWidth:1,borderRadius:18,padding:22,alignItems:'center',marginTop:20},crest:{fontSize:42},clubName:{color:'#FFF',fontSize:23,fontWeight:'900',marginTop:8},muted:{color:'#91A0B6',fontSize:12,marginTop:5},coins:{color:'#B8F34A',fontSize:18,fontWeight:'900',marginTop:14},section:{color:'#B8F34A',fontSize:10,fontWeight:'900',letterSpacing:1.5,marginTop:26,marginBottom:10},stats:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},stat:{width:'48%',backgroundColor:'#111C29',padding:16,borderRadius:12,marginBottom:9},statNum:{color:'#FFF',fontSize:24,fontWeight:'900'},formations:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:13},formation:{backgroundColor:'#111C29',borderColor:'#243545',borderWidth:1,borderRadius:10,padding:13,minWidth:'47%',alignItems:'center'},active:{borderColor:'#B8F34A',backgroundColor:'#203B2A'},formText:{color:'#FFF',fontWeight:'900'},action:{backgroundColor:'#111C29',borderColor:'#243545',borderWidth:1,borderRadius:13,padding:16,marginBottom:9},actionTitle:{color:'#FFF',fontWeight:'900',fontSize:15},note:{color:'#718398',fontSize:11,lineHeight:18,marginTop:15}});
