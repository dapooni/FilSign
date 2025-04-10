import React, { useState } from 'react';
import { View, TouchableOpacity, Image, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import VideoPlayer from './components/VideoPlayer';

import TranslateDropdown from './components/DropDown/Translate';
import CameraSetup from './components/CameraSetup';

import { styles } from "./components/styles";
import { useTheme } from "./components/ThemeContext";

export default function App() {
  const { isDarkMode } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [fromValue, setFromValue] = useState('1'); // Default to 'FSL GESTURE'
  const [toValue, setToValue] = useState('2'); // Default to 'TEXT/SPEECH'
  const [glossText, setGlossText] = useState(''); // State for storing the typed gloss
  const [fontsLoaded] = useFonts({
    'AlbertSans-Medium': require('./assets/fonts/AlbertSans-Medium.ttf'),
    'Akatab-SemiBold': require('./assets/fonts/Akatab-SemiBold.ttf') // Load Fonts
  });
  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  const swapValues = () => {
    setFromValue(toValue);
    setToValue(fromValue);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Camera Setup */}
      <CameraSetup />
      
      {/* Two-Way Communication Choices */}
      <View style={styles.transContainer}>
        <View style={styles.transDropdown}>
          <TranslateDropdown
            selectedValue={fromValue}
            onSelect={setFromValue}
          />
        </View>
        {/* Switch FromSelected to ToSelected */}
        <TouchableOpacity style={styles.circle} onPress={swapValues}>
          <Image
            style={styles.switchIcon}
            source={require('./assets/images/switch-way.png')}
          />
        </TouchableOpacity>
        <View style={styles.transDropdown}>
          <TranslateDropdown
            selectedValue={toValue}
            onSelect={setToValue}
          />
        </View>
      </View>

      {/* Text Input/Output Container */}
      <View
        style={[
          styles.textContainer,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#96B4E8',
            borderWidth: isDarkMode ? 1 : 1,             
            borderColor: isDarkMode ? 'gray' : 'white', 
          },
        ]}
      >
        <TextInput
            style={[
                styles.text,
                { color: isDarkMode ? '#fff' : '#000' } 
            ]}
            editable={fromValue !== '1'} // Disable input when FSL GESTURE is selected
            placeholder={fromValue !== '1' ? "Type gloss here..." : ""}
            placeholderTextColor={isDarkMode ? '#aaa' : '#000'}
            value={glossText}
            onChangeText={(text) => setGlossText(text)} // Update state when typing
            />
        
        {/* Speaker/Microphone */}
        <TouchableOpacity style={styles.speakerButton} onPress={() => setIsPressed((prevState) => !prevState)}>
          <Image
              style={styles.cameraIcon}
              source={
                fromValue === '1'
                  ? (isPressed
                      ? require('./assets/images/speaker-pressed.png')
                      : require('./assets/images/speaker.png'))
                  : (isPressed
                      ? require('./assets/images/mic-pressed.png')
                      : require('./assets/images/mic.png'))
              }
            />
        </TouchableOpacity>
      </View>

      {/* Video Player - Display video based on gloss input */}
      {glossText !== '' && <VideoPlayer glossText={glossText} />}
    </View>
  );
}
