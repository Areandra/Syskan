import React from 'react';
import HomeScreen from './screens/homeScreens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalProvider } from './service/GlobalContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BackHandlerProvider from './utils/BackHandlerProvider'
import DraftInvoiceScreen from './screens/DraftInvoiceScreen';
import NewInvoiceScreen from './screens/NewInvoiceScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
  <NavigationContainer>
    <GlobalProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
      <LinearGradient
        colors={['#0C324D', '#061b29', '#020202']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen name="DraftInvoiceScreen" component={DraftInvoiceScreen} />
            <Stack.Screen name="NewInvoiceScreen" component={NewInvoiceScreen} />
          </Stack.Navigator>
        </SafeAreaView>
      </LinearGradient>
      </PaperProvider>
    </GestureHandlerRootView>
    </GlobalProvider>
  </NavigationContainer>
  );
}