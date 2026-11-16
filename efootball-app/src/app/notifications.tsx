import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const projectId =
  Constants.easConfig?.projectId ??
  Constants.expoConfig?.extra?.eas?.projectId ??
  null;

export default function NotificationsScreen() {
  const [permission, setPermission] = useState('Haijaombwa');
  const [pushToken, setPushToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Washa taarifa ili upokee ratiba na matokeo ya mashindano.');

  useEffect(() => {
    let received: Notifications.EventSubscription | undefined;
    let response: Notifications.EventSubscription | undefined;
    Notifications.getPermissionsAsync().then(({ status }) => setPermission(status));
    received = Notifications.addNotificationReceivedListener((notification) => {
      const title = notification.request.content.title ?? 'Taarifa mpya';
      setMessage('Imepokelewa: ' + title);
    });
    response = Notifications.addNotificationResponseReceivedListener((event) => {
      const title = event.notification.request.content.title ?? 'Taarifa';
      setMessage('Umefungua taarifa: ' + title);
    });
    return () => {
      received?.remove();
      response?.remove();
    };
  }, []);

  async function enablePush() {
    if (Platform.OS === 'web') {
      setMessage('Push notifications za simu zinahitaji Android/iOS build. Web haitumii Expo Push SDK.');
      return;
    }
    if (!Device.isDevice) {
      setMessage('Tumia simu halisi ya Android kujaribu push notifications.');
      return;
    }
    setBusy(true);
    try {
      const current = await Notifications.getPermissionsAsync();
      let status = current.status;
      if (status !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync();
        status = requested.status;
      }
      setPermission(status);
      if (status !== 'granted') {
        setMessage('Ruhusa haijatolewa. Ruhusu notifications kwenye mipangilio ya simu.');
        return;
      }
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('match-updates', {
          name: 'Taarifa za Mashindano',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#B7F34A',
        });
      }
      if (!projectId) {
        setMessage('Ruhusa imewashwa. Expo Project ID bado haijaunganishwa; fanya eas init kabla ya kupata Push Token.');
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      setPushToken(token.data);
      setMessage('Push Token imepatikana kwenye kifaa hiki.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Imeshindikana kuwasha taarifa.');
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    if (Platform.OS === 'web') {
      setMessage('Jaribio la notification lifanyike kwenye Android build.');
      return;
    }
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'EFOOTBALL ARENA',
          body: 'Jaribio limefanikiwa! Utaarifiwa kuhusu mechi na matokeo.',
          sound: true,
          data: { screen: 'explore' },
        },
        trigger: null,
      });
      setMessage('Taarifa ya majaribio imetumwa kwenye simu hii.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Jaribio halikufanikiwa.');
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>EFOOTBALL ARENA / ALERT CENTER</Text>
      <Text style={styles.title}>Push Notifications</Text>
      <Text style={styles.subtitle}>Pata taarifa za mechi, ratiba, matokeo na matangazo hata ukiwa nje ya programu.</Text>

      <View style={styles.statusCard}>
        <Text style={styles.label}>HALI YA RUHUSA</Text>
        <Text style={styles.status}>{permission.toUpperCase()}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <TouchableOpacity disabled={busy} style={styles.primary} onPress={enablePush}>
        <Text style={styles.primaryText}>{busy ? 'INAWASHA...' : 'WASHA PUSH NOTIFICATIONS'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondary} onPress={sendTest}>
        <Text style={styles.secondaryText}>TUMA TAARIFA YA MAJARIBIO</Text>
      </TouchableOpacity>

      {pushToken ? (
        <View style={styles.tokenCard}>
          <Text style={styles.label}>EXPO PUSH TOKEN YA KIFAA HIKI</Text>
          <Text selectable style={styles.token}>{pushToken}</Text>
          <Text style={styles.hint}>Token hii itahifadhiwa kwenye hifadhidata ya mashindano tutakapounganisha backend.</Text>
        </View>
      ) : null}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Taarifa utakazopokea</Text>
        {['Mechi inakaribia kuanza', 'Ratiba mpya imechapishwa', 'Matokeo yametangazwa', 'Umealikwa kwenye mashindano', 'Tangazo kutoka kwa msimamizi'].map((item) => (
          <Text key={item} style={styles.infoItem}>•  {item}</Text>
        ))}
      </View>
      <Text style={styles.footer}>Push za mbali zinahitaji EAS Project ID, credentials za Android na huduma ya kutuma taarifa. Jaribio la hapa ni local notification.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#07111f' },
  content: { padding: 22, paddingTop: 30, paddingBottom: 44, gap: 16 },
  kicker: { color: '#b7f34a', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: '#f4f7fb', fontSize: 28, fontWeight: '900' },
  subtitle: { color: '#91a2b7', fontSize: 13, lineHeight: 20 },
  statusCard: { backgroundColor: '#162b3c', borderColor: '#315044', borderWidth: 1, borderRadius: 16, padding: 17, marginTop: 8 },
  label: { color: '#b7f34a', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  status: { color: '#f4f7fb', fontSize: 19, fontWeight: '900', marginTop: 9 },
  message: { color: '#b4c2d0', fontSize: 12, lineHeight: 18, marginTop: 8 },
  primary: { backgroundColor: '#b7f34a', borderRadius: 12, padding: 16, alignItems: 'center' },
  primaryText: { color: '#14200d', fontSize: 11, fontWeight: '900' },
  secondary: { borderColor: '#54713d', borderWidth: 1, borderRadius: 12, padding: 15, alignItems: 'center' },
  secondaryText: { color: '#b7f34a', fontSize: 11, fontWeight: '900' },
  tokenCard: { backgroundColor: '#101f32', borderColor: '#20364d', borderWidth: 1, borderRadius: 14, padding: 15 },
  token: { color: '#d5e3ef', fontSize: 10, lineHeight: 16, marginTop: 10 },
  hint: { color: '#91a2b7', fontSize: 10, lineHeight: 15, marginTop: 9 },
  infoCard: { backgroundColor: '#101f32', borderColor: '#20364d', borderWidth: 1, borderRadius: 14, padding: 16, gap: 11 },
  infoTitle: { color: '#f4f7fb', fontSize: 14, fontWeight: '800', marginBottom: 2 },
  infoItem: { color: '#b4c2d0', fontSize: 12 },
  footer: { color: '#71849a', fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 4 },
});
