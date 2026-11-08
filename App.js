import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import CatalogScreen from './screens/CatalogScreen';
import DetailFormScreen from './screens/DetailFormScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Catalog">
        <Stack.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Event Passes' }} />
        <Stack.Screen
          name="DetailForm"
          component={DetailFormScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} options={{ title: 'Confirmed' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
