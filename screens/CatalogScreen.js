import { FlatList, Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { EVENTS } from '../data';

export default function CatalogScreen({ navigation }) {
  // Adaptive UI: column count follows the current window width
  const { width, height } = useWindowDimensions();
  const cols = width < 600 ? 2 : width < 900 ? 3 : 4;
  const orientation = width > height ? 'Landscape' : 'Portrait';
  const cardWidth = (width - 12) / cols - 12; // fixed width so cards keep their column size even with few items
  const imageSize = { width: cardWidth, height: cardWidth * 0.75 }; // explicit size: local images ignore aspectRatio

  const renderItem = ({ item }) => (
    <Pressable
      style={[styles.card, { width: cardWidth }]}
      onPress={() =>
        // Dynamic navigation: pass the selected item's params
        navigation.navigate('DetailForm', { itemId: item.id, title: item.title, basePrice: item.basePrice })
      }
    >
      {item.logos ? (
        <View style={[imageSize, styles.logoRow]}>
          {item.logos.map((logo, i) => (
            <Image key={i} source={logo} style={styles.logo} resizeMode="contain" />
          ))}
        </View>
      ) : (
        <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={imageSize} resizeMode="cover" />
      )}
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.meta}>{item.date} · {item.venue}</Text>
      <Text style={styles.price}>from ${item.basePrice}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>{orientation} · {Math.round(width)}px · {cols} columns</Text>
      <FlatList
        key={cols} // numColumns can't change on the fly, so remount when it changes
        data={EVENTS}
        numColumns={cols}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f8' },
  badge: { textAlign: 'center', padding: 8, color: '#555', fontWeight: '600' },
  list: { padding: 6 },
  card: { margin: 6, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', paddingBottom: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#fff' },
  logo: { width: '38%', aspectRatio: 1 },
  title: { fontSize: 15, fontWeight: '700', marginTop: 8, marginHorizontal: 8 },
  meta: { fontSize: 12, color: '#666', marginHorizontal: 8, marginTop: 2 },
  price: { fontSize: 14, color: '#4b3fd6', fontWeight: '700', marginHorizontal: 8, marginTop: 6 },
});
