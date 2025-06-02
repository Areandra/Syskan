import React, { useRef } from 'react';
import { Text, TextInput } from 'react-native';
import { useFonts, Rubik_400Regular } from '@expo-google-fonts/rubik';

// --- kode override font global (pakai Inter sebagai contoh) ---
const defaultFontFamily = 'Rubik_400Regular';

const oldTextRender = Text.render;
Text.render = function (...args) {
  const origin = oldTextRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [{ fontFamily: defaultFontFamily }, origin.props.style],
  });
};

const oldInputRender = TextInput.render;
TextInput.render = function (...args) {
  const origin = oldInputRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [{ fontFamily: defaultFontFamily }, origin.props.style],
  });
};

import HomeScreen, { styles } from './screens/homeScreens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalProvider, useGlobal } from './service/GlobalContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import DraftInvoiceScreen from './screens/DraftInvoiceScreen';
import NewInvoiceScreen from './screens/NewInvoiceScreen';
import ModalProvider from './utils/ModalProvider';
import TruckLoader from './components/loader/Loaders';

const Stack = createStackNavigator();

const allRoutes = [
  { name: 'HomeScreen' },
  { name: 'DraftInvoiceScreen' },
  { name: 'NewInvoiceScreen' },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });
  const navigationRef = useRef();

  if (!fontsLoaded) {
    return (
      <LinearGradient
      colors={['#0C324D', '#061b29', '#020202']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}
      >
      </LinearGradient>
    );
  }

  const onStateChange = () => {
    const nav = navigationRef.current;
    if (!nav) return;

    const state = nav.getRootState();
    const index = state.index;
    const activeRoute = state.routes[index];

    const activeRouteIndex = allRoutes.findIndex(r => r.name === activeRoute.name);

    if (activeRouteIndex === -1) return;

    const expectedRoutes = allRoutes.slice(0, activeRouteIndex + 1);

    const currentRoutes = state.routes.map(r => ({ name: r.name }));
    const isSame =
      currentRoutes.length === expectedRoutes.length &&
      currentRoutes.every((r, i) => r.name === expectedRoutes[i].name);

    if (!isSame) {
      nav.reset({
        index: activeRouteIndex,
        routes: expectedRoutes,
      });
    }
  };

  return (
    <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
      <GlobalProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LinearGradient
            colors={['#0C324D', '#061b29', '#020202']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <ModalProvider GlobalContext={useGlobal} />
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  transitionSpec: {
                    open: TransitionSpecs.TransitionIOSSpec,
                    close: TransitionSpecs.TransitionIOSSpec,
                  },
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                }}
              >
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="DraftInvoiceScreen" component={DraftInvoiceScreen} />
                <Stack.Screen name="NewInvoiceScreen" component={NewInvoiceScreen} />
              </Stack.Navigator>
            </SafeAreaView>
          </LinearGradient>
        </GestureHandlerRootView>
      </GlobalProvider>
    </NavigationContainer>
  );
}
