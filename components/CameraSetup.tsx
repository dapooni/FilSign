import React, { useState, useRef } from 'react';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Text, View, Button, TouchableOpacity, Image} from 'react-native';
import { styles } from "./styles";
import SettingDropdown from './DropDown/Setting';
import { useTheme } from './ThemeContext';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('front');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView | null>(null);
    const { isDarkMode } = useTheme();

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

    return(
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.upperButtons}>
            <SettingDropdown />
            <TouchableOpacity onPress={toggleCameraFacing}>
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
        </CameraView>
    );
}