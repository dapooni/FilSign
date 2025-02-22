import React, { useState, useRef } from 'react';
import { Text, View, Button, TouchableOpacity, Image, TextInput } from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useFonts } from 'expo-font';
import VideoPlayer from './components/VideoPlayer';

import SettingDropdown from './components/DropDown/Setting';
import TranslateDropdown from './components/DropDown/Translate';
import { styles } from "./components/styles"; 

export default function App() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState<string>('2'); // Default to "TEXT/SPEECH"
  const [fromValue, setFromValue] = useState('1'); // Default to 'FSL GESTURE'
  const [toValue, setToValue] = useState('2'); // Default to 'TEXT/SPEECH'
  const [glossText, setGlossText] = useState(''); // State for storing the typed gloss

  const swapValues = () => {
    setFromValue(toValue);
    setToValue(fromValue);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.mainContainer}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'front' ? 'back' : 'front'));
  }

  return (
    <View style={styles.mainContainer}>
      {/* Camera Setup */}
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.upperButtons}>
          <SettingDropdown />
          <TouchableOpacity onPress={toggleCameraFacing}>
            <Image style={styles.cameraIcon} source={require('./assets/images/light-camrotate.png')} />
          </TouchableOpacity>
        </View>
      </CameraView>

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
      <View style={styles.textContainer}>
        <TextInput
          style={styles.text}
          editable={fromValue !== '1'} // Disable input when FSL GESTURE is selected
          placeholder={fromValue !== '1' ? "Type gloss here..." : ""}
          placeholderTextColor="#000"
          value={glossText}
          onChangeText={(text) => setGlossText(text)} // Update state when typing
        />
        
        {/* Speaker/Microphone */}
        <TouchableOpacity style={styles.speakerButton} onPress={() => setIsPressed((prevState) => !prevState)}>
          <Image
            style={styles.cameraIcon}
            source={isPressed ? require('./assets/images/speaker-pressed.png') : require('./assets/images/speaker.png')}
          />
        </TouchableOpacity>
      </View>

      {/* Video Player - Display video based on gloss input */}
      {glossText !== '' && <VideoPlayer glossText={glossText} />}
    </View>
  );
}
