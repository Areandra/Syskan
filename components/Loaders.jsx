import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

export default function TruckLoader() {
  const motionAnim = useRef(new Animated.Value(0)).current; // for truckBody vertical movement
  const roadAnim = useRef(new Animated.Value(350)).current;   // for road and lampPost horizontal movement

  useEffect(() => {
    // Truck suspension animation (up and down)
    Animated.loop(
      Animated.sequence([
        Animated.timing(motionAnim, {
          toValue: 3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(motionAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Road and lampPost animation (scroll to left)
    Animated.loop(
      Animated.timing(roadAnim, {
        toValue: -350,
        duration: 1400,
        useNativeDriver: true,
      })
    ).start();
  }, [motionAnim, roadAnim]);

  return (
    <View style={styles.loader}>
      <View style={styles.truckWrapper}>
        <Animated.View
          style={[
            styles.truckBody,
            { transform: [{ translateY: motionAnim }] },
          ]}
        >
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 198 93"
            width={130}
            height={60}
          >
            <Path
              strokeWidth={3}
              stroke="#282828"
              fill="white"
              d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
            />
            <Path
              strokeWidth={3}
              stroke="#282828"
              fill="#7D7C7C"
              d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
            />
            <Path
              strokeWidth={2}
              stroke="#282828"
              fill="#282828"
              d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z"
            />
            <Rect
              strokeWidth={2}
              stroke="#282828"
              fill="#FFFCAB"
              rx={1}
              height={7}
              width={5}
              y={63}
              x={187}
            />
            <Rect
              strokeWidth={2}
              stroke="#282828"
              fill="#282828"
              rx={1}
              height={11}
              width={4}
              y={81}
              x={193}
            />
            <Rect
              strokeWidth={3}
              stroke="#282828"
              fill="#DFDFDF"
              rx={2.5}
              height={90}
              width={110}
              y={1.5}
              x={16.5}
            />
            <Rect
              strokeWidth={3}
              stroke="#282828"
              fill="white"
              rx={2.5}
              height={30}
              width={121}
              y={60}
              x={6.5}
            />
            <Rect
              strokeWidth={2}
              stroke="#282828"
              fill="#DFDFDF"
              rx={2}
              height={4}
              width={6}
              y={84}
              x={1}
            />
          </Svg>
        </Animated.View>

        <View style={styles.truckTires}>
          {[0, 1].map((i) => (
            <Svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 30 30"
              width={24}
              height={24}
            >
              <Circle
                strokeWidth={3}
                stroke="#282828"
                fill="#282828"
                r={13.5}
                cy={15}
                cx={15}
              />
              <Circle fill="#DFDFDF" r={7} cy={15} cx={15} />
            </Svg>
          ))}
        </View>

        <Animated.View
          style={[
            styles.road,
            {
              transform: [{ translateX: roadAnim }],
            },
          ]}
        >
          <View style={styles.roadBefore} />
          <View style={styles.roadAfter} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: -20,
    // width: 'auto' atau biarkan default,
  },
  truckWrapper: {
    width: 200,
    height: 100,
    flexDirection: 'column',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  truckBody: {
    width: 130,
    marginBottom: 6,
  },
  truckTires: {
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 10,
    position: 'absolute',
    bottom: 0,
  },
  road: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#282828',
    position: 'relative',
    bottom: 0,
    alignSelf: 'flex-end',
    borderRadius: 3,
    flexDirection: 'row',
  },
  roadBefore: {
    width: 20,
    height: '100%',
    backgroundColor: '#282828',
    borderRadius: 3,
    borderLeftWidth: 10,
    borderLeftColor: 'white',
    marginRight: 5,
  },
  roadAfter: {
    width: 10,
    height: '100%',
    backgroundColor: '#282828',
    borderRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: 'white',
  },
});