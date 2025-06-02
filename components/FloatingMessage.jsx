// components/FloatingMessage.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

const screenHeight = Dimensions.get('window').height;

const FloatingMessage = ({ message, visible, onHide, duration = 3000 }) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: screenHeight * 0.75, // 3/4 dari atas
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  messageBox: {
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    maxWidth: '85%',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FloatingMessage;