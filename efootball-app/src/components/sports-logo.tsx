import { Text, View } from 'react-native';

export default function SportsLogo({ size = 58 }: { size?: number }) {
  const tile = size * 0.27;
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="KICKOFF WINS GIFTS logo: football, basketball, tennis, esports and trophy"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#142331',
        borderWidth: 2,
        borderColor: '#B8F34A',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#B8F34A',
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 3,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <Text style={{ fontSize: tile }}>⚽</Text>
        <Text style={{ fontSize: tile }}>🏀</Text>
      </View>
      <Text style={{ color: '#B8F34A', fontSize: size * 0.19, fontWeight: '900', lineHeight: size * 0.22 }}>KWG</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <Text style={{ fontSize: tile }}>🎾</Text>
        <Text style={{ fontSize: tile }}>🏆</Text>
      </View>
    </View>
  );
}
