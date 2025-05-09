import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import glossDictionary from '../constants/glossDictionary';
import { filipinoToEnglish } from '../constants/filipinoToEnglish';

const VideoPlayer = ({ glossText }: { glossText: string }) => {
  const [videoUris, setVideoUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videosPreloaded, setVideosPreloaded] = useState(false); // Tracks if all videos are preloaded
  const videoRef = useRef<Video>(null);
  const [isPressed, setIsPressed] = useState(false);

useEffect(() => {
  let inputText = glossText.trim().toUpperCase();
  let words = inputText.split(' ');

  let matchedGlosses: string[] = [];

  let i = 0;
  while (i < words.length) {
    let foundMatch = false;

    // Check for multi-word glosses first
    for (let j = words.length; j > i; j--) {
      let phrase = words.slice(i, j).join(' ');

      // Convert Filipino phrase to English if available
      let translatedPhrase = filipinoToEnglish[phrase] || phrase;

      if (typeof translatedPhrase === 'string' && glossDictionary.some(item => item.gloss.toUpperCase() === translatedPhrase.toUpperCase())) {
        if (typeof translatedPhrase === 'string') {
          matchedGlosses.push(translatedPhrase.toUpperCase());
        }
        i = j; // move index forward
        foundMatch = true;
        break;
      }
    }

    // If no multi-word match, fallback to single word
    if (!foundMatch) {
      let singleWord = words[i];

      // Convert Filipino single word to English if available
      let translatedWord = filipinoToEnglish[singleWord] || singleWord;

      if (typeof translatedWord === 'string') {
        matchedGlosses.push(translatedWord.toUpperCase());
      }
      i++;
    }
  }

  const foundVideos = matchedGlosses
    .map(gloss =>
      glossDictionary.find(item => item.gloss.toUpperCase() === gloss.toUpperCase())?.videoUrl
    )
    .filter(Boolean) as string[];

  setVideoUris(foundVideos);
  setCurrentIndex(0);
  setLoading(false);
}, [glossText]);

  // Function to preload all videos
  const preloadVideos = (videos: string[]) => {
    let preloadedCount = 0;

    videos.forEach((uri, index) => {
      const video = videoRef.current;

      if (video) {
        video.loadAsync({ uri })
          .then(() => {
            preloadedCount++;
            if (preloadedCount === videos.length) {
              setVideosPreloaded(true); // Set preloaded state to true when all videos are loaded
            }
          })
          .catch(err => {
            console.error("Error preloading video:", err);
          });
      }
    });
  };

  const handleVideoEnd = () => {
    if (currentIndex < videoUris.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View style={styles.container}>
      {videoUris.length > 0 ? (
        <>
          <TouchableOpacity 
          style={styles.playButton}
            onPress={() => setModalVisible(true)}
          >
            <Image
              style={styles.buttonIcon}
              source={
                isPressed
                  ? require('../assets/images/play-pressed-icon.png')
                  : require('../assets/images/play-icon.png')
              }
            />
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            statusBarTranslucent={true}
          >
            <View style={styles.modalContainer}>
              <Video
                ref={videoRef}
                source={{ uri: videoUris[currentIndex] }}
                style={styles.video}
                useNativeControls
                shouldPlay
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={(status: any) => {
                  if (status?.didJustFinish) {
                    handleVideoEnd();
                  }
                }}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      ) : (
        <Text>No videos found for "{glossText}"</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center', 
    marginTop: 5,
    marginBottom: 10, 
  },

  playText: { 
    marginTop: -10,
    fontSize: 14,
    color: 'white',
    fontFamily: 'Akatab-SemiBold', 
    textDecorationLine: 'underline' 
  },
  
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    width: '100%', 
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  video: { 
    width: '90%', 
    height: '50%' 
  },

  closeText: { 
    marginTop: 10, 
    fontSize: 18, 
    color: 'white', 
    textDecorationLine: 'underline' 
  },

  noteText: {
    marginTop: -10,
    fontSize: 14,
    color: 'white',
    fontFamily: 'Akatab-SemiBold'
  },

  playButton: { 
    position: 'absolute',
    bottom: -65,
    right: -5,
  },

  buttonIcon:{
    width: 45,
    height: 45,
  },

});


export default VideoPlayer;