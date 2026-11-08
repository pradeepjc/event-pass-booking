import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ConfirmationScreen({ route, navigation }) {
  const { order } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.check}>✅</Text>
      <Text style={styles.header}>Booking confirmed!</Text>
      <Text style={styles.line}>{order.quantity} × {order.ticketType} pass for {order.title}</Text>
      <Text style={styles.line}>Name: {order.name}</Text>
      <Text style={styles.line}>Email: {order.email}</Text>
      <Text style={styles.line}>Parking: {order.parking ? 'Yes' : 'No'}</Text>
      <Text style={styles.total}>Total paid: ${order.total}</Text>
      <Pressable style={styles.button} onPress={() => navigation.popToTop()}>
        <Text style={styles.buttonText}>Back to catalog</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  check: { fontSize: 48 },
  header: { fontSize: 24, fontWeight: '700', marginVertical: 12 },
  line: { fontSize: 16, marginVertical: 2 },
  total: { fontSize: 18, fontWeight: '700', marginTop: 12 },
  button: { backgroundColor: '#4b3fd6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
