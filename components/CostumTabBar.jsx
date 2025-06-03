import { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, FlatList, Alert } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, interpolate, Extrapolate, runOnJS, } from 'react-native-reanimated';
import { useEffect } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useGlobal } from '../service/GlobalContext';
import { db } from '../service/firebase/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';
import CircleButton from './button/CircleButton';
import ItemList from './ItemList';
import InvoiceList from './InvoiceList';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CustomTabBar({ routes, loading, tabData }) {
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);
  const expandedY = -SCREEN_HEIGHT * 0.59 + 36;
  const collapsedY = 0;
  const halfExpandedY = expandedY / 10;
  const { currentTab, setCurrentTab } = useGlobal();
  const { setIsAtTop } = useGlobal();
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

  const progressValues = useRef(
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
        <View style={{width: '88%', left: 8, zIndex:10}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.tabBar}>
              {routes?.map((route) => {
                const isFocused = currentTab === route.key;
                const progress = progressValues[route.key];

                const animatedIconStyle = useAnimatedStyle(() => ({
                  transform: [
                    { translateY: interpolate(progress.value, [0, 1], [4.5,29], Extrapolate.CLAMP) },
                    { scale: interpolate(progress.value, [0, 1], [1, 1.3], Extrapolate.CLAMP) },
                  ],
                }));

                const animatedCircleStyle = useAnimatedStyle(() => ({
                  opacity: progress.value,
                  transform: [
                    { translateY: interpolate(progress.value, [0, 1], [10, 13.9], Extrapolate.CLAMP) },
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
          { currentTab === 'Beranda' 
            ? ( <InvoiceList /> )
            : ( <ItemList data={tabData[currentTab]} /> )
          }
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: -SCREEN_HEIGHT * 0.59,
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
    borderTopRightRadius: '55%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    opacity: 0,
    zIndex: -1,
  },
  bar: {
    // Removed position absolute and bottom negative
    height: SCREEN_HEIGHT * 0.58 + 35,
    left: '2.5%',
    right: 0,
    width: '95%',
    borderTopLeftRadius: '0%',
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexGrow: 1,
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
});

