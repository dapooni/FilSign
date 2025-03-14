import React, { useState, useRef } from 'react';
import { Animated, TouchableOpacity, Image, StyleSheet, View, Modal, Text, Pressable } from 'react-native';
import { useTheme } from '.././ThemeContext';

export default function Dropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [tutorialStep, setTutorialStep] = useState(0);
  
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
        <Image
          style={styles.settingIcon}
          source={
            isDarkMode
              ? require('../../assets/images/dark-setting.png')
              : require('../../assets/images/light-setting.png')
          }
        />
      </TouchableOpacity>
      {showDropdown && (
        <Animated.View style={[styles.dropdownContainer, { opacity: dropdownOpacity }]}>
          {/* Dark/Light Mode Button */}
          <TouchableOpacity style={styles.dropdownButton} onPress={toggleTheme}>
          <Image
            style={styles.image}
            source={
              isDarkMode
                ? require('../../assets/images/light-mode.png')
                : require('../../assets/images/dark-mode.png')
            }
          />
        </TouchableOpacity>
          {/* Tutorial Button */}
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => setModalVisible(true)} // Open the modal when pressed
          >
            <Image 
              style={styles.image} 
              source={
                isDarkMode
                  ? require('../../assets/images/dark-tutorial.png')
                  : require('../../assets/images/light-tutorial.png')
              }
            />
          </TouchableOpacity>
          <Modal 
            visible={modalVisible} 
            transparent={true} 
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.8)', borderColor: isDarkMode ? 'gray' : 'transparent', borderWidth: isDarkMode ? 1 : 0, }]}>
                <Pressable style={styles.exitContainer} onPress={() => {
                      setModalVisible(false);
                      setTutorialStep(0);
                    }}>
                <Image 
                  style={styles.exitIcon} 
                  source={
                    isDarkMode
                      ? require('../../assets/images/light-exit-icon.png')
                      : require('../../assets/images/dark-exit-icon.png')
                  }
                />
                </Pressable>
                <Text style={[styles.header, { color: isDarkMode ? '#FFF' : '#000' }]}>LET GET STARTED</Text>
                <Text style={[styles.text, { color: isDarkMode ? '#DDD' : '#000' }]}>
                  {tutorialStep === 0
                    ? "Want to understand them more? You'll see two options: \"TEXT/SPEECH\" and \"FSL GESTURE\"."
                    : "Want to understand a deaf friend? Open the camera to know what they are saying"}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.buttonSkip} onPress={() => {
                      setModalVisible(false);
                      setTutorialStep(0);
                    }}>
                    <Text style={[styles.textButton, { color: isDarkMode ? '#FFF' : '#000' }]}>SKIP TUTORIAL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonNext} onPress={() => setTutorialStep(1)}>
                    <Text style={styles.textNext}>NEXT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 20,
    width: 330,           
    height: 260,          
    justifyContent: 'space-between',
  },
  exitIcon: {
    width: 15,
    height: 15,
  },
  exitContainer:{
    flexDirection: "row",
    justifyContent: "flex-end", // Moves the button to the right
    padding: 5,
    marginBottom: -30
  },
  header:{
    fontSize: 24,
    padding: 5,
    fontFamily: 'Akatab-SemiBold',
    marginBottom: -25
  },
  text: {
    fontSize: 15,
    textAlign: 'justify',
    paddingBottom: 20,
    padding: 5,
    fontFamily: 'AlbertSans-Medium',
    lineHeight: 22,
    marginBottom: -10
  },
  buttonContainer:{
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -10
  },
  buttonSkip: {
    paddingVertical: 20, // Extra padding
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonNext: {
    marginRight: 10,
    backgroundColor: "#CE1126", // Red color for NEXT button
    paddingVertical: 20, // Extra padding
    paddingHorizontal: 45,
    borderRadius: 15,
  },
  textNext:{
    color: "#FFFFFF", // White text
    fontSize: 15,
    textAlign: "center",
    fontFamily: 'AlbertSans-Medium',
  },
  textButton: {
    fontSize: 15,
    fontFamily: 'AlbertSans-Medium',
  },
});
