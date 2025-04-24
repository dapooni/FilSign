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

          {/* Modal */}
          <Modal 
            visible={modalVisible} 
            transparent={true} 
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                    borderColor: isDarkMode ? 'gray' : 'transparent',
                    borderWidth: isDarkMode ? 1 : 0,
                  },
                ]}
              >
                <Text style={[styles.header, { color: isDarkMode ? '#FFF' : '#000' }]}>
                  WELCOME TO FILSIGN!
                </Text>

                {/* Tutorial Images */}
                {tutorialStep === 0 && (
                <Image source={require('../../assets/images/icon.png')} style={styles.iconImage} />
                )}
                {tutorialStep === 1 && (
                <Image source={require('../../assets/images/tutorial-1.png')} style={styles.tutorialImage} />
                )}
                {tutorialStep === 2 && (
                  <Image source={require('../../assets/images/tutorial-1.png')} style={styles.tutorialImage} />
                )}
                {tutorialStep === 3 && (
                  <Image source={require('../../assets/images/tutorial-2.png')} style={styles.tutorialImage} />
                )}
                {tutorialStep === 4 && (
                  <Image source={require('../../assets/images/tutorial-3.png')} style={styles.tutorialImage} />
                )}
                {tutorialStep === 5 && (
                  <Image source={require('../../assets/images/tutorial-4.png')} style={styles.tutorialImage} />
                )}

                {/* Tutorial Text */}
                <Text style={[styles.text, { color: isDarkMode ? '#DDD' : '#000' }]}>
                  {tutorialStep === 0 && 
                    "Filsign helps you bridge communication between spoken language and Filipino Sign Language (FSL). This app recognizes hand gestures, converts them to text, and even speaks them out loud — and vice versa!"}
                  {tutorialStep === 1 &&
                    "More Button: Tap to reveal additional options and settings.\n\n" +
                    "Dark/Light Mode: Switch between light and dark themes.\n\n" +
                    "Help Button: View this instruction guide."}
                  {tutorialStep === 2 &&
                    "Camera Switch: Toggle between front and rear cameras.\n\n" +
                    "Landmarks On/Off: Show or hide hand tracking landmarks.\n\n" +
                    "Clear Output: Reset the current output to start fresh with new gestures."}
                  {tutorialStep === 3 &&
                    "In this container, you'll see two options: TEXT/SPEECH and FSL GESTURE"}
                  {tutorialStep === 4 &&
                    "FSL GESTURE to TEXT/SPEECH:\n\n" +
                    "Speaker: Plays the translated output aloud."}
                  {tutorialStep === 5 &&
                    "TEXT/SPEECH to FSL GESTURE:\n\n" +
                    "Play Video: Displays the FSL translation of your input.\n\n" +
                    "Microphone: Speak instead of typing."}
                </Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.buttonSkip}
                    onPress={() => {
                      setModalVisible(false);
                      setTutorialStep(0);
                    }}
                  >
                    <Text style={[styles.textButton, { color: isDarkMode ? '#FFF' : '#000' }]}>
                      SKIP TUTORIAL
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonNext}
                    onPress={() => {
                      if (tutorialStep < 5) {
                        setTutorialStep(tutorialStep + 1);
                      } else {
                        setModalVisible(false);
                        setTutorialStep(0);
                      }
                    }}
                  >
                    <Text style={styles.textNext}>
                      {tutorialStep < 5 ? 'NEXT' : 'DONE'}
                    </Text>
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
    width: 53,
    height: 53,
  },
  settingIcon: {
    width: 45,
    height: 45,
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
    height: 450,          
    justifyContent: 'space-between',
  },
  exitIcon: {
    width: 15,
    height: 15,
  },
  exitContainer:{
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 5,
    marginBottom: -30
  },
  header:{
    fontSize: 20,
    padding: 5,
    fontFamily: 'Akatab-SemiBold',
    marginBottom: -25,
    textAlign: 'center'
  },
  text: {
    fontSize: 14,
    textAlign: 'justify',
    paddingBottom: 20,
    padding: 5,
    fontFamily: 'AlbertSans-Medium',
    lineHeight: 16,
    marginBottom: -10
  },
  buttonContainer:{
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonSkip: {
    paddingVertical: 13, 
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonNext: {
    marginRight: 10,
    backgroundColor: "#CE1126", 
    paddingVertical: 13, 
    paddingHorizontal: 45,
    borderRadius: 15,
  },
  textNext:{
    color: "#FFFFFF", 
    fontSize: 15,
    textAlign: "center",
    fontFamily: 'AlbertSans-Medium',
  },
  textButton: {
    fontSize: 15,
    fontFamily: 'AlbertSans-Medium',
  },
  tutorialImage: {
    width: 260, 
    height: 180, 
    margin: 5, 
    alignSelf: 'center'
  },
  iconImage:{
    width: 250, 
    height: 100,
    alignSelf: 'center'
  }
});
