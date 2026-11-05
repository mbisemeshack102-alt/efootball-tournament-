import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>eFootball Arena</Text>
      <Text style={styles.subtitle}>Mashindano ya Simu</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ingia kwenye Mashindano</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
        <Text style={styles.buttonText}>Jisajili (Register)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#00FF00', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#CCCCCC', marginBottom: 40 },
  button: { backgroundColor: '#00FF00', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 15 },
  secondaryButton: { backgroundColor: '#333333', borderWidth: 1, borderColor: '#00FF00' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

