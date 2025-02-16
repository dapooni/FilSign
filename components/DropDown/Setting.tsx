import React, { useState, useRef } from 'react';
import { Animated, TouchableOpacity, Image, StyleSheet, View, Modal, Text, Button, Pressable} from 'react-native';

export default function Dropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  
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
          <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => setModalVisible(true)} // Open the modal when pressed
      >
        <Image style={styles.image} source={require('../../assets/images/light-tutorial.png')} />
      </TouchableOpacity>
        <Modal 
          visible={modalVisible} 
          transparent={true} 
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Pressable style={styles.exitContainer} onPress={() => setModalVisible(false)}>
                <Image source={require('../../assets/images/exit-icon.png')} style={styles.exitIcon} />
              </Pressable>
              <Text style={styles.header}>LET GET STARTED</Text>
              <Text style={styles.text}>Want to understand them more? You'll see two options: "TEXT/SPEECH" and "FSL GESTURE".</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonSkip} onPress={() => setModalVisible(false)}>
                  <Text>SKIP TUTORIAL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonNext}>
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  exitIcon: {
    width: 15,
    height: 15,
  },
  exitContainer:{
    flexDirection: "row",
    justifyContent: "flex-end", // Moves the button to the right
    padding: 10, // Add padding for spacing
  },
  header:{
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingBottom: 20
  },
  text: {
    fontSize: 14,
    textAlign: 'justify',
    paddingBottom: 35
  },
  buttonContainer:{
    flexDirection: "row",
    justifyContent: "space-between",

  },
  buttonSkip: {
    paddingVertical: 14, // Extra padding
    paddingHorizontal: 25,
    borderRadius: 30,
  },

  buttonNext: {
    marginRight: 10,
    backgroundColor: "#CE1126", // Red color for NEXT button
    paddingVertical: 14, // Extra padding
    paddingHorizontal: 45,
    borderRadius: 30,
  },
  textNext:{
    color: "#FFFFFF", // White text
    fontSize: 14,
    textAlign: "center",
  }
});