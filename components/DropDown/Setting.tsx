import React, { useState, useRef } from 'react';
import { Animated, TouchableOpacity, Image, StyleSheet, View } from 'react-native';

export default function Dropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownOpacity = useRef(new Animated.Value(0)).current;

  function toggleDropdown() {
    if (showDropdown) {
      // Fade out animation
      Animated.timing(dropdownOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowDropdown(false));
    } else {
      setShowDropdown(true);
      // Fade in animation
      Animated.timing(dropdownOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }

  return (
    <View>
      {/* Setting Button */}
      <TouchableOpacity onPress={toggleDropdown}>
        <Image style={styles.settingIcon} source={require('../../assets/images/light-setting.png')} />
      </TouchableOpacity>
      {showDropdown && (
        <Animated.View style={[styles.dropdownContainer, { opacity: dropdownOpacity }]}>
          {/* Dark/Light Mode Button */}
          <TouchableOpacity style={styles.dropdownButton}>
            <Image style={styles.image} source={require('../../assets/images/dark-mode.png')} />
          </TouchableOpacity>
          {/* Tutorial Button */}
          <TouchableOpacity style={styles.dropdownButton}>
            <Image style={styles.image} source={require('../../assets/images/light-tutorial.png')} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    top: 50,
  },
  dropdownButton: {
    padding: 2,
    justifyContent: 'flex-start',
  },
  image: {
    width: 50,
    height: 50,
  },
  settingIcon: {
    width: 43,
    height: 43,
    marginLeft: 5
  },
});