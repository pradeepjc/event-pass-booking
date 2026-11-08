import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

const TICKET_TYPES = ['General', 'VIP', 'Backstage'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, quantity }) {
  const errors = {};
  const qty = Number(quantity);
  if (!name.trim()) errors.name = 'Name is required';
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!Number.isInteger(qty) || quantity.trim() === '') errors.quantity = 'Quantity must be a whole number';
  else if (qty < 1 || qty > 10) errors.quantity = 'Quantity must be between 1 and 10';
  return errors;
}

export default function DetailFormScreen({ route, navigation }) {
  // Params passed from the catalog grid
  const { itemId, title, basePrice } = route.params;

  // Controlled form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [ticketType, setTicketType] = useState('General');
  const [parking, setParking] = useState(false);
  const [touched, setTouched] = useState({});

  // Real-time validation on every render
  const errors = validate({ name, email, quantity });
  const isValid = Object.keys(errors).length === 0;
  const total = isValid ? basePrice * Number(quantity) : 0;

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));
  const showError = (field) => Boolean(touched[field] && errors[field]);

  const submit = () => {
    if (!isValid) return;
    navigation.navigate('Confirmation', {
      order: { itemId, title, basePrice, name: name.trim(), email: email.trim(), quantity: Number(quantity), ticketType, parking, total },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.sub}>Item ID: {itemId} · Base price: ${basePrice}</Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput
        style={[styles.input, showError('name') && styles.inputError]}
        value={name}
        onChangeText={(v) => { setName(v); touch('name'); }}
        onBlur={() => touch('name')}
        placeholder="Jane Doe"
      />
      {showError('name') && <Text style={styles.error}>{errors.name}</Text>}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, showError('email') && styles.inputError]}
        value={email}
        onChangeText={(v) => { setEmail(v); touch('email'); }}
        onBlur={() => touch('email')}
        placeholder="jane@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {showError('email') && <Text style={styles.error}>{errors.email}</Text>}

      <Text style={styles.label}>Quantity (1–10)</Text>
      <TextInput
        style={[styles.input, showError('quantity') && styles.inputError]}
        value={quantity}
        onChangeText={(v) => { setQuantity(v); touch('quantity'); }}
        onBlur={() => touch('quantity')}
        keyboardType="number-pad"
      />
      {showError('quantity') && <Text style={styles.error}>{errors.quantity}</Text>}

      <Text style={styles.label}>Ticket type</Text>
      <View style={styles.row}>
        {TICKET_TYPES.map((t) => (
          <Pressable key={t} onPress={() => setTicketType(t)} style={[styles.chip, ticketType === t && styles.chipActive]}>
            <Text style={[styles.chipText, ticketType === t && styles.chipTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.row, styles.switchRow]}>
        <Text style={styles.label}>Add parking</Text>
        <Switch value={parking} onValueChange={setParking} />
      </View>

      <Text style={styles.total}>Total: ${total}</Text>

      <Pressable onPress={submit} disabled={!isValid} style={[styles.button, !isValid && styles.buttonDisabled]}>
        <Text style={styles.buttonText}>{isValid ? 'Book now' : 'Complete the form to book'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontSize: 22, fontWeight: '700' },
  sub: { color: '#666', marginBottom: 12 },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  inputError: { borderColor: '#d33' },
  error: { color: '#d33', marginTop: 4 },
  row: { flexDirection: 'row', gap: 8 },
  switchRow: { justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#4b3fd6' },
  chipActive: { backgroundColor: '#4b3fd6' },
  chipText: { color: '#4b3fd6', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  total: { fontSize: 18, fontWeight: '700', marginTop: 16 },
  button: { backgroundColor: '#4b3fd6', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { backgroundColor: '#b9b9c9' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
