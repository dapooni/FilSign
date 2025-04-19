import React, { useEffect, useState } from 'react';
import { useCameraPermission, useCameraDevice, Camera } from 'react-native-vision-camera';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { styles } from './styles';
import { useTheme } from './ThemeContext';
import SettingDropdown from './DropDown/Setting';


export default function App() {
  const { isDarkMode } = useTheme();
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const frontDevice = useCameraDevice('front');
  const backDevice = useCameraDevice('back');

  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  console.log('has permissions: ', hasPermission);

  if (!hasPermission) {
    return <View />; // No camera permission
  }

  // Fallback if no camera device is found
  const device = isFrontCamera ? frontDevice : backDevice;

  if (!device) {
    return <Text>Camera device not found</Text>;
  }
  
  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera device={device} isActive={true} style={styles.camera}></Camera>
      <View style={styles.upperButtons}>
        <SettingDropdown />
        <TouchableOpacity onPress={toggleCamera}>
          <Image
            style={styles.cameraIcon}
            source={
              isDarkMode
                ? require('../assets/images/dark-camrotate.png')
                : require('../assets/images/light-camrotate.png')
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
