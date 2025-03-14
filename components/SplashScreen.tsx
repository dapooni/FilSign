import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type SplashScreenProps = {
  isDarkMode: boolean;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ isDarkMode }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinnerColor = isDarkMode ? '#ffffff' : '#000000';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <Image
        source={
            isDarkMode
            ? require('../assets/images/light-splash.png')
            : require('../assets/images/dark-splash.png')
        }
        style={styles.image}
        resizeMode="contain"
        />
        <Animated.View style={{ transform: [{ rotate: spin }], marginBottom: 20 }}>
            <Svg width={30} height={30} viewBox="0 0 100 100">
                <Circle
                cx="50"
                cy="50"
                r="45"
                stroke={spinnerColor}
                strokeWidth="10"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset="75"
                strokeLinecap="round"
                />
            </Svg>
        </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 380,
    height: 380,
    marginBottom: 20,
  },
});
