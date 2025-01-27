import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';

import SettingDropdown from './navigation/SettingDropDown';
import TranslateDropdown from './navigation/TranslateDropDown'

export default function App() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
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
          {/* Setting Button */}
          <SettingDropdown />
          {/* Camera Rotate */}
          <TouchableOpacity onPress={toggleCameraFacing}>
            <Image style={styles.image} source={require('./assets/images/light-camrotate.png')} />
          </TouchableOpacity>
        </View>
      </CameraView>
      {/* Two-Way Communication Choices  */}
      {/* FROM */}
      <View style={styles.anotherContainer}>
        <View style={styles.translateContainer}>
          <TranslateDropdown
            data={[
              { value: "FSL", label: "FSL GESTURE" }, 
              { value: "TS", label: "TEXT/SPEECH" },
            ]}
            onChange={console.log}
            placeholder="FROM"
          />
        </View>
        {/* TO */}
        <View style={styles.translateContainer}>
          <TranslateDropdown
            data={[
              { value: "FSL", label: "FSL GESTURE" }, 
              { value: "TS", label: "TEXT/SPEECH" },
            ]}
            onChange={console.log}
            placeholder="TO"
          />
        </View>
      </View>
      {/* Text Input/Output Container */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          HELLO MY NAME IS PHIL FROM LEG. CITY, ALBAY, PHILIPPINES
        </Text>
        {/* Speaker/Microphone*/}
        <TouchableOpacity style={styles.speakerButton} onPress={() => setIsPressed((prevState) => !prevState)} >
        <Image style={styles.image} source={ isPressed
              ? require('./assets/images/speaker-pressed.png') 
              : require('./assets/images/speaker.png')}/>
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
  textContainer: {  // Box container for Text Input/Output
    width: '90%', 
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#96B4E8',
    borderRadius: 30,
    padding: 15,
    shadowColor: '#000', //Shadow
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6.27,
    elevation: 10, 
    alignSelf: 'center',
    marginTop: -15
  },
  text: {   // Text container for Text Input/Output
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
  anotherContainer: { // Box container for translate
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
  translateContainer: {  // Box container for per choice of translate
    width: '50%', 
    height: 55,
    borderRadius: 30,
  }
});
