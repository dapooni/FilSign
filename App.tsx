import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import Main from './Main';
import SplashScreen from './components/SplashScreen';

export default function App() {
  return (
    <ThemeProvider>
      <AppWithSplash />
    </ThemeProvider>
  );
}

const AppWithSplash = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen isDarkMode={isDarkMode} />;
  }

  return <Main />;
};
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import HomeScreen from './screens/HomeScreen';
// import TranscriptionScreen from './screens/TranscriptionScreen';
// import OtherScreen from './screens/OtherScreen';

// // Define the type for our stack navigator param list
// export type RootStackParamList = {
//   Home: undefined;
//   Transcription: undefined;
//   OtherScreen: undefined;
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const App: React.FC = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
//         <Stack.Screen 
//           name="Transcription" 
//           component={TranscriptionScreen} 
//           options={{ title: 'Live Transcription' }} 
//         />
//         <Stack.Screen 
//           name="OtherScreen" 
//           component={OtherScreen} 
//           options={{ title: 'Other Screen' }} 
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;