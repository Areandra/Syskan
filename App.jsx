import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, FlatList } from 'react-native';
import HomeScreen from './screens/homeScreens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { GlobalProvider, useGlobal } from './service/GlobalContext';
import { Provider as PaperProvider } from 'react-native-paper';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const tabData = {
  Home: [
    { id: '1', name: 'iPhone 14 Pro', price: '$700', quantity: '67 items', location: '20 City', store: 'Store 2' },
    { id: '2', name: 'iPhone 14', price: '$700', quantity: '20 items', location: '20 City', store: 'Store 2' },
    // Tambahkan data lainnya
  ],
  Settings1: [
    { id: '1', name: 'MacBook Pro', price: '$1200', quantity: '15 items', location: '30 City', store: 'Store 1' },
    // Data untuk tab Settings1
  ],
  // Data untuk tab lainnya
};


function ItemList({ data }) {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.quantity}>{item.quantity}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <View style={styles.locationContainer}>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.store}>{item.store}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
}

function CustomTabBar() {
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);
  const expandedY = -SCREEN_HEIGHT * 0.58;
  const collapsedY = 0;
  const halfExpandedY = expandedY / 10;
  const { currentTab, setCurrentTab } = useGlobal();
  const { setIsAtTop } = useGlobal();

  const routes = [
    { key: 'Home', title: 'Home', content: <Text style={{color: 'white'}}>Home Content</Text> },
    { key: 'Settings1', title: 'Settings 1', content: <Text style={{color: 'white'}}>Settings 1 Content</Text> },
    { key: 'Settings2', title: 'Settings 2', content: <Text style={{color: 'white'}}>Settings 2 Content</Text> },
    { key: 'Settings3', title: 'Settings 3', content: <Text style={{color: 'white'}}>Settings 3 Content</Text> },
    { key: 'Settings4', title: 'Settings 4', content: <Text style={{color: 'white'}}>Settings 4 Content</Text> },
  ];

  const onReachedTop = () => setIsAtTop(true);
  const setCollapsed = () => setIsAtTop(false);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const newTranslateY = Math.max(expandedY, Math.min(collapsedY, startY.value + event.translationY));
      translateY.value = newTranslateY;

      if (newTranslateY <= halfExpandedY) {
        runOnJS(onReachedTop)();
      } else {
        runOnJS(setCollapsed)();
      }
    })
    .onEnd(() => {
      if (translateY.value < halfExpandedY) {
        translateY.value = withTiming(expandedY, undefined, (finished) => {
          if (finished) runOnJS(onReachedTop)();
        });
      } else {
        translateY.value = withTiming(collapsedY, undefined, (finished) => {
          if (finished) runOnJS(setCollapsed)();
        });
      }
    });

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const progressValues = React.useRef(
    routes.reduce((acc, route) => {
      acc[route.key] = useSharedValue(currentTab === route.key ? 1 : 0);
      return acc;
    }, {})
  ).current;

  useEffect(() => {
    routes.forEach((route) => {
      const isFocused = currentTab === route.key;
      progressValues[route.key].value = withTiming(isFocused ? 1 : 0, { duration: 300 });
    });
  }, [currentTab]);

  const gestureOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.gestureOverlay, gestureOverlayStyle]} />
      </GestureDetector>

      <Animated.View style={[styles.tabBarContainer, containerAnimatedStyle]}>
        <View style={{width: '91%', left: '4.5%'}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.tabBar}>
              {routes.map((route) => {
                const isFocused = currentTab === route.key;
                const progress = progressValues[route.key];
                
                const animatedIconStyle = useAnimatedStyle(() => ({
                  transform: [
                    { translateY: interpolate(progress.value, [0, 1], [-10, 10], Extrapolate.CLAMP) },
                    { scale: interpolate(progress.value, [0, 1], [1, 1.3], Extrapolate.CLAMP) },
                  ],
                }));

                const animatedCircleStyle = useAnimatedStyle(() => ({
                  opacity: progress.value,
                  transform: [
                    { translateY: interpolate(progress.value, [0, 1], [10, -1.4], Extrapolate.CLAMP) },
                    { scale: interpolate(progress.value, [0, 1], [1, 1.3], Extrapolate.CLAMP) },
                  ],
                }));
                
                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={() => setCurrentTab(route.key)}
                    style={styles.tabButton}
                    activeOpacity={0.7}
                  >
                    <Animated.View style={animatedIconStyle}>
                      <Animated.Text style={{ color: isFocused ? '#fff' : '#888', fontSize: 16 }}>{route.title}</Animated.Text>
                    </Animated.View>
                    <Animated.View style={[styles.circle, animatedCircleStyle]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View style={styles.bar}>
          <View style={styles.contentContainer}>
            <ItemList data={tabData[currentTab]} />
          </View>
        </View>
      </Animated.View>
    </>
  );
}

export default function App() {
  return (
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
          <HomeScreen />
          <CustomTabBar />
        </SafeAreaView>
      </LinearGradient>
      </PaperProvider>
    </GestureHandlerRootView>
    </GlobalProvider>
  );
}

// Styles tetap sama


const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
    width: '100%',
    zIndex: 10,
  },
  scrollContainer: {
    paddingHorizontal: 0,

  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 30,
    height: 80,
    alignItems: 'center',
  },
  tabButton: {
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  circle: {
    position: 'absolute',
    top: 10,
    width: 90,
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    opacity: 0,
    zIndex: -1,
  },
  bar: {
    position: 'absolute',
    height: SCREEN_HEIGHT * 0.58 + 35,
    left: '2.5%',
    right: 0,
    bottom: -SCREEN_HEIGHT * 0.58 - 20,
    width: '95%',
    borderTopLeftRadius: '5%',
    borderTopRightRadius: '5%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: -1,
  },
  gestureOverlay: {
    position: 'absolute',
    bottom: 105,
    left: 0,
    right: 0,
    height: 50, // sama dengan tinggi tab bar
    backgroundColor: 'transparent',
    zIndex: 20,
  },
    contentContainer: {
    height: 300, // Sesuaikan tinggi sesuai kebutuhan
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 14,
    color: '#888',
  },
  store: {
    fontSize: 14,
    color: '#888',
  },
});