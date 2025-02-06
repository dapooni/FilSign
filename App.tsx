import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, TextInput } from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef } from 'react';

import SettingDropdown from './navigation/SettingDropDown';
import TranslateDropdown from './navigation/TranslateDropDown';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState<string>('2'); // Default to "TEXT/SPEECH"
  const [fromValue, setFromValue] = useState('1'); // Default to 'FSL GESTURE'
  const [toValue, setToValue] = useState('2'); // Default to 'TEXT/SPEECH'

  const swapValues = () => {
    setFromValue(toValue);
    setToValue(fromValue);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'front' ? 'back' : 'front'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <SettingDropdown />
          <TouchableOpacity onPress={toggleCameraFacing}>
            <Image style={styles.image} source={require('./assets/images/light-camrotate.png')} />
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Two-Way Communication Choices */}
      <View style={styles.anotherContainer}>
        <View style={styles.translateContainer}>
          <TranslateDropdown
            selectedValue={fromValue}
            onSelect={setFromValue}
          />
        </View>
        {/* Switch FromSelected to ToSelected */}
        <TouchableOpacity style={styles.circle} onPress={swapValues}>
          <Image
            style={styles.imageswitch}
            source={require('./assets/images/switch-way.png')}
          />
        </TouchableOpacity>
        <View style={styles.translateContainer}>
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
          placeholder={fromValue !== '1' ? "Type here..." : ""}
          placeholderTextColor="#000"
        />
        
        {/* Speaker/Microphone */}
        <TouchableOpacity style={styles.speakerButton} onPress={() => setIsPressed((prevState) => !prevState)}>
          <Image
            style={styles.image}
            source={isPressed ? require('./assets/images/speaker-pressed.png') : require('./assets/images/speaker.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#0C4CBE'
  },
  camera: {
    flex: 0,
    height: '80%',
    width: '100%', 
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    paddingTop: 44,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  image: {
    width: 50,
    height: 50,
  },
  textContainer: {
    width: '90%', 
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#96B4E8',
    borderRadius: 30,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6.27,
    elevation: 10, 
    alignSelf: 'center',
    marginTop: -15
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 10,
    fontFamily: 'AlbertSans-Medium'
  },
  speakerButton: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  anotherContainer: {
    width: '90%',
    backgroundColor: 'rgba(8, 48, 129, 0.7)',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderRadius: 30,
    paddingBottom: 15,
    alignSelf: 'center',
    marginTop: -100,
    marginBottom: 30,
    height: 55,
  },
  translateContainer: {
    width: '45%', 
    height: 55,
    borderRadius: 30,
  },
  circle: {
    width: 35, 
    height: 35,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15, 
  },
  imageswitch: { // Switch Way
    marginTop: 5,
    width: 35,
    height: 25,
  }
});
