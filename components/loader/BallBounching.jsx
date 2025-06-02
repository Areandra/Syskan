import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

const BouncingCircle = ({ delay, position }) => {
  const bounce = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(1.7)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bounce, {
            toValue: -60,
            duration: 500,
            delay,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
          Animated.timing(scaleX, {
            toValue: 1,
            duration: 250,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 500,
            delay,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(bounce, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.in(Easing.quad),
          }),
          Animated.timing(scaleX, {
            toValue: 1.7,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [bounce, scaleX, delay]);

  return (
    <View style={[styles.itemWrapper, { left: position }]}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ translateY: bounce }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.shadow,
          {
            transform: [{ scaleX }],
            opacity,
          },
        ]}
      />
    </View>
  );
};

const Loader = () => {
  return (
    <View style={styles.container}>
      <BouncingCircle delay={0} position={'15%'} />
      <BouncingCircle delay={200} position={'45%'} />
      <BouncingCircle delay={300} position={'75%'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 80,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemWrapper: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  shadow: {
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginTop: 5,
  },
});

export default Loader;
