import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { isSupabaseConfigured, supabaseProjectUrl } from '@/lib/supabase';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [sound, setSound] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const rows = [
    { title: 'Push notifications', detail: 'Pokea matangazo ya mfumo', value: notifications, change: setNotifications },
    { title: 'Match reminders', detail: 'Kumbushwa kabla ya mechi', value: matchAlerts, change: setMatchAlerts },
    { title: 'Game sounds', detail: 'Sauti za taarifa ndani ya app', value: sound, change: setSound },
    { title: 'Public player profile', detail: 'Ruhusu wachezaji kuona profile yako', value: publicProfile, change: setPublicProfile },
  ];
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>PLAYER CONTROL</Text>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Mipangilio ya akaunti na uzoefu wa mashindano.</Text>
      <Text style={styles.section}>SUPABASE DATABASE</Text>
      <View style={styles.databaseCard}>
        <View style={styles.databaseHeader}>
          <Text style={styles.name}>Supabase project</Text>
          <Text style={[styles.status, { color: isSupabaseConfigured ? '#B8F34A' : '#FFC66D' }]}>
            {isSupabaseConfigured ? 'KEY CONFIGURED' : 'KEY REQUIRED'}
          </Text>
        </View>
        <Text style={styles.detail}>Project URL</Text>
        <Text selectable style={styles.projectUrl}>{supabaseProjectUrl}</Text>
        <Text style={styles.detail}>
          {isSupabaseConfigured
            ? 'Publishable key imepatikana. Hali hii inathibitisha usanidi wa app, si kipimo cha live database.'
            : 'Weka EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY kwenye GitHub Actions secrets na EAS production environment.'}
        </Text>
      </View>
      <Text style={styles.section}>PREFERENCES</Text>
      {rows.map((row) => (
        <View key={row.title} style={styles.row}>
          <View style={styles.info}><Text style={styles.name}>{row.title}</Text><Text style={styles.detail}>{row.detail}</Text></View>
          <Switch value={row.value} onValueChange={row.change} trackColor={{ false: '#344354', true: '#527A32' }} thumbColor={row.value ? '#B8F34A' : '#C5CFD9'} />
        </View>
      ))}
      <Text style={styles.section}>TOURNAMENT SETTINGS</Text>
      <View style={styles.infoCard}>
        <Text style={styles.name}>Time zone</Text><Text style={styles.detail}>Africa/Dar_es_Salaam (EAT, UTC+3)</Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.name}>Competition formats</Text><Text style={styles.detail}>Solo • Duo • Squad • League • Knockout</Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.name}>Fair play</Text><Text style={styles.detail}>Match reporting, dispute review and player blocking.</Text>
      </View>
      <Text style={styles.footer} onPress={() => Alert.alert('KICKOFF WINS GIFTS', 'Supabase project configuration is shown above. Account security and privacy tools will be connected next.')}>Version 1.0 • Account • Privacy • Help</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080D16' },
  content: { padding: 20, paddingTop: 32, paddingBottom: 40 },
  kicker: { color: '#B8F34A', fontWeight: '900', fontSize: 10, letterSpacing: 2 },
  title: { color: '#F4F7FC', fontSize: 29, fontWeight: '900', marginTop: 8 },
  subtitle: { color: '#91A0B6', lineHeight: 21, marginTop: 7, marginBottom: 22 },
  section: { color: '#B8F34A', fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginTop: 15, marginBottom: 9 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111C29', borderWidth: 1, borderColor: '#243545', borderRadius: 13, padding: 14, marginBottom: 9 },
  info: { flex: 1 },
  name: { color: '#F4F7FC', fontWeight: '800', fontSize: 13, marginBottom: 4 },
  detail: { color: '#91A0B6', fontSize: 11, lineHeight: 17 },
  databaseCard: { backgroundColor: '#111C29', borderWidth: 1, borderColor: '#527A32', borderRadius: 13, padding: 14, marginBottom: 9, gap: 8 },
  databaseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  status: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  projectUrl: { color: '#B8F34A', fontSize: 11, marginBottom: 3 },
  infoCard: { backgroundColor: '#111C29', borderWidth: 1, borderColor: '#243545', borderRadius: 13, padding: 14, marginBottom: 9 },
  footer: { color: '#718398', fontSize: 10, textAlign: 'center', marginTop: 22 },
});
