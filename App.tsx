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
