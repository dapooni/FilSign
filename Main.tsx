import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, TextInput, Text } from 'react-native';
import { useFonts } from 'expo-font';
import VideoPlayer from './components/VideoPlayer';
import SpeechToText from "./components/SpeechToText";
import * as Speech from 'expo-speech';
import io, { Socket } from 'socket.io-client';
import { WebView } from 'react-native-webview';

import TranslateDropdown from './components/DropDown/Translate';
import SettingDropdown from './components/DropDown/Setting';

import { styles } from "./components/styles";
import { useTheme } from "./components/ThemeContext";

// Define a constant for the placeholder text
const WAITING_TEXT = "WAITING FOR SIGNS...";
// Flask server URL
const SERVER_URL = 'https://classic-proven-kingfish.ngrok-free.app/';

// Define types for prediction data
interface PredictionResult {
  prediction: string;
  confidence: number;
  top_predictions: Array<{
    action: string;
    probability: number;
  }>;
}

interface ServerError {
  error: string;
}

// Function to format text: uppercase and replace underscores with spaces
const formatDisplayText = (text: string): string => {
  if (!text) return '';
  
  // Replace underscores with spaces and convert to uppercase
  return text.replace(/_/g, ' ').toUpperCase();
};

export default function App() {
  // Define all refs at the top of your component
  const socketRef = useRef<Socket | null>(null);
  const webViewRef = useRef<WebView>(null);
  
  // Then all state variables
  const { isDarkMode } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [fromValue, setFromValue] = useState('1'); // Default to 'FSL GESTURE'
  const [toValue, setToValue] = useState('2'); // Default to 'TEXT/SPEECH'
  const [glossText, setGlossText] = useState(WAITING_TEXT); // Initial state with waiting text
  const [recognizedSigns, setRecognizedSigns] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [isEyeOn, setIsEyeOn] = useState(false);

  const [fontsLoaded] = useFonts({
    'AlbertSans-Medium': require('./assets/fonts/AlbertSans-Medium.ttf'),
    'Akatab-SemiBold': require('./assets/fonts/Akatab-SemiBold.ttf')
  });

  useEffect(() => {
    if (webViewRef.current) {
      const themeScript = `
        (function() {
          // Create or update CSS variables for theming
          let style = document.getElementById('react-native-theme');
          if (!style) {
            style = document.createElement('style');
            style.id = 'react-native-theme';
            document.head.appendChild(style);
          }
          
          // Set the theme variables based on isDarkMode
          if (${isDarkMode}) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            style.textContent = \`
              :root {
                --background-color: #1e1e1e;
                --text-color: #ffffff;
                --button-bg: #333333;
                --button-text: #ffffff;
                --border-color: #444444;
                --icon-color: #71A1FF;
              }
              svg path {
                stroke: #71A1FF !important;
              }
            \`;
              // Direct DOM manipulation for SVG elements
              const cameraBtnSVG = document.querySelector('#toggle-camera-btn svg');
              if (cameraBtnSVG) {
                const paths = cameraBtnSVG.querySelectorAll('path');
                paths.forEach(path => {
                  path.setAttribute('stroke', '#71A1FF');
                });
              }
              
              // Apply to other SVG elements
              document.querySelectorAll('svg path[stroke="#0038A8"]').forEach(path => {
                path.setAttribute('stroke', '#71A1FF');
              });
          } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            style.textContent = \`
              :root {
                --background-color: #ffffff;
                --text-color: #000000;
                --button-bg: #f0f0f0;
                --button-text: #000000;
                --border-color: #cccccc;
                --icon-color: #0038A8;
              }
                     
              svg path {
                stroke: #0038A8 !important;
              }
            \`;

          // Direct DOM manipulation for SVG elements
          const cameraBtnSVG = document.querySelector('svg');
          if (cameraBtnSVG) {
            const paths = cameraBtnSVG.querySelectorAll('path');
            paths.forEach(path => {
              path.setAttribute('stroke', '#0038A8');
            });
          }
          
          // Reset other SVG elements
          document.querySelectorAll('svg path[stroke="#71A1FF"]').forEach(path => {
            path.setAttribute('stroke', '#0038A8');
          });
          }
          
          // Apply the theme to body and specific elements
          document.body.style.backgroundColor = 'var(--background-color)';
          document.body.style.color = 'var(--text-color)';
          
          // Apply to specific elements that need consistent styling
          document.querySelectorAll('button, .btn').forEach(btn => {
            btn.style.backgroundColor = 'var(--button-bg)';
            btn.style.color = 'var(--button-text)';
          });
          
          // Return true for iOS
          true;
        })();
      `;
      
      webViewRef.current.injectJavaScript(themeScript);
    }
  }, [isDarkMode]); // Re-run when theme changes

  // Connect to Socket.IO server when in FSL mode
  useEffect(() => {
    // Only establish connection when in FSL GESTURE mode
    if (fromValue === '1') {
      connectSocket();
    }

    // Cleanup function to disconnect socket when component unmounts
    // or when switching away from FSL mode
    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fromValue]); // Re-run when fromValue changes

  // Update display text whenever recognized signs change
  useEffect(() => {
    if (fromValue === '1') {
      if (recognizedSigns.length > 0) {
        // Format each sign before joining them
        const formattedSigns = recognizedSigns.map(sign => formatDisplayText(sign));
        // Join the formatted signs into a sentence
        setGlossText(formattedSigns.join(' '));
      } else {
        // Show waiting text if no signs recognized
        setGlossText(WAITING_TEXT);
      }
    }
  }, [recognizedSigns, fromValue]);

  // Function to establish socket connection
  const connectSocket = () => {
    console.log('Attempting to connect to socket server:', SERVER_URL);
    
    // Create socket connection with options
    socketRef.current = io(SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Set up event listeners
    socketRef.current.on('connect', () => {
      console.log('Socket connected!');
      setConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socketRef.current.on('prediction_result', (data: PredictionResult) => {
      console.log('Received prediction:', data);
      handlePredictionResult(data);
    });

    socketRef.current.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });
  };

  const [predictions, setPredictions] = useState<string[]>([]);
  const threshold = 0.5; // Adjust this value as needed

  // Updated prediction handler with the same logic as your web app
  // Add these debugging logs to your handlePredictionResult function
  const handlePredictionResult = (data: PredictionResult) => {
    console.log('Received prediction:', data.prediction, 'with confidence:', data.confidence);

    // Skip processing if the prediction is "no_sign"
    if (data.prediction === "no_sign") {
      console.log('Skipping "no_sign" prediction');
      return;
    }
    // Update predictions array (buffering) with callback to ensure we use the latest state
    setPredictions(prev => {
      const newPredictions = [...prev, data.prediction];
      console.log('Prediction buffer size:', newPredictions.length);
      
      // Process immediately inside this callback to use the updated predictions array
      if (newPredictions.length >= 2) {
        // Get the last 10 predictions
        const lastTenPredictions = newPredictions.slice(-10);
        
        // Find the most common prediction
        const mostCommon = findMostCommon(lastTenPredictions);
        console.log('Most common prediction:', mostCommon, 'Current:', data.prediction);
        
        // Add to sentence if consistent and confidence is high
        if (data.confidence > threshold && mostCommon === data.prediction) {
          console.log('Conditions met, should add to recognized signs');
          
          // Update recognized signs in its own setState call
          setRecognizedSigns(prevSigns => {
            if (prevSigns.length === 0 || prevSigns[prevSigns.length - 1] !== data.prediction) {
              console.log('Adding to recognized signs:', data.prediction);
              return [...prevSigns, data.prediction];
            }
            console.log('Prediction already in recognized signs, not adding');
            return prevSigns;
          });
        } else {
          console.log(
            'Conditions not met:', 
            `confidence: ${data.confidence} > ${threshold} = ${data.confidence > threshold}`,
            `mostCommon(${mostCommon}) === current(${data.prediction}) = ${mostCommon === data.prediction}`
          );
        }
      } else {
        console.log('Not enough predictions yet, need at least 10');
      }
      
      // Keep the predictions array at a reasonable size
      return newPredictions.length > 30 ? newPredictions.slice(-30) : newPredictions;
    });
  };

  // Helper function to find the most common element in an array
  const findMostCommon = (arr: string[]): string => {
    const counts: Record<string, number> = {};
    let maxCount = 0;
    let maxItem = '';
    
    for (const item of arr) {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        maxCount = counts[item];
        maxItem = item;
      }
    }
    
    return maxItem;
  };

  // Clear all recognized signs
  const clearSigns = () => {
    setRecognizedSigns([]);
    if (fromValue === '1') {
      setGlossText(WAITING_TEXT);
    }
  };

  const swapValues = () => {
    const newFromValue = toValue;
    const newToValue = fromValue;
    
    // Clear text when switching modes
    if (newFromValue === '1') {
      setGlossText(WAITING_TEXT);
    } else {
      setGlossText('');
    }
    
    setFromValue(newFromValue);
    setToValue(newToValue);
  };

  // Handle text input changes
  const handleTextChange = (text: string) => {
    // Only allow typing in non-FSL mode
    if (fromValue !== '1') {
      setGlossText(text);
    }
  };

  // Handle speaker/mic button press
  const handleButtonPress = () => {
    setIsPressed(prev => !prev);
    
    // Clear recognized signs when button is pressed in FSL mode
    if (fromValue === '1') {
      clearSigns();
    }
    // Add speech-to-text functionality here for the other mode
  };

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  const handleEyeToggle = () => {
    setIsEyeOn(prev => !prev);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Upper Buttons */}
      <View style={styles.upperButtons} pointerEvents="box-none">
        <SettingDropdown />
        <View style={styles.rightButtons}>
          {/* Clear Text Outputs */}
          <TouchableOpacity style={{ marginTop: 6 }} onPress={clearSigns}>
            <Image
              style={[
                styles.restartIcon,
              ]}
              source={
                isDarkMode
                ? require('./assets/images/dark-restart-icon.png')
                : require('./assets/images/light-restart-icon.png')
              }
            /> 
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Connection status indicator - optional */}
      {fromValue === '1' && (
        <View style={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: connected ? 'rgba(0,255,0,0.5)' : 'rgba(255,0,0,0.5)',
          padding: 5,
          borderRadius: 5,
          zIndex: 100
        }}>
          <Text style={{ color: 'white', fontSize: 12 }}>
            {connected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      )}
      
      {/* WebView for camera interface */}
      <WebView 
        ref={webViewRef}
        source={{ uri: SERVER_URL }}
        style={styles.cameraView}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={() => true}
        onError={(syntheticEvent) => {
          console.log('WebView error: ', syntheticEvent.nativeEvent);
        }}
          onHttpError={(syntheticEvent) => {
          console.log('WebView HTTP error: ', syntheticEvent.nativeEvent);
        }}
        onMessage={(event) => {
          // Optional: Handle messages from web app
          console.log('Message from WebView:', event.nativeEvent.data);
        }}
       />

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
      <View style={[ styles.textContainer,
        {
          backgroundColor: isDarkMode ? 'rgba(30,30,30,0.9)' : 'rgba(185,210,255,0.9)',
          borderWidth: isDarkMode ? 1 : 1,             
          borderColor: isDarkMode ? 'gray' : 'white', 
        },
      ]}>
        <TextInput
          style={[
            styles.text,
            { 
              color: isDarkMode ? '#fff' : '#000',
              fontStyle: fromValue === '1' && glossText === WAITING_TEXT ? 'italic' : 'normal'
            } 
          ]}
          editable={fromValue !== '1'} // Disable input when FSL GESTURE is selected
          placeholder={fromValue !== '1' ? "Type gloss here..." : ""}
          placeholderTextColor={isDarkMode ? '#aaa' : '#000'}
          value={glossText}
          onChangeText={handleTextChange}
          multiline={true}
          numberOfLines={3}
          scrollEnabled={true}
        />
  
        {/* Speaker/Microphone Button */}
        <TouchableOpacity
          style={styles.speakerButton}
          onPress={() => {
            if (fromValue === '1') {
              // ✅ TEXT TO SPEECH
              if (glossText.trim() !== '') {
                Speech.speak(glossText, {
                  language: 'en', // or 'fil'
                  pitch: 1.1,
                  rate: 1.0,
                });
              }
            } else {
              // 🎤 SPEECH TO TEXT or ▶️ Play
              setIsPressed(prev => !prev);
            }
          }}
        >
        <Image
          style={styles.buttonIcon}
          source={
            fromValue === '1'
              ? require('./assets/images/speaker.png')
              : (isPressed
                ? require('./assets/images/mic-pressed.png')       // Mic pressed
                : require('./assets/images/mic.png'))              // Mic idle
          }
        />
        </TouchableOpacity>

        {/* Video Player - Display video based on gloss input */}
        {fromValue === '2' && glossText !== '' && (
          <VideoPlayer glossText={glossText} />
        )}
      </View>

      {/* Speech-to-Text Component */}
      <SpeechToText isListening={isPressed} onTranscription={setGlossText} />

    </View>
  );
}