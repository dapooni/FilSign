import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import glossDictionary from '../constants/glossDictionary';
import { filipinoToEnglish } from '../constants/filipinoToEnglish';


const ignoredWords = new Set(["THE", "IS", "A", "AN", "OF", "AND", "TO"]);
const numberToGloss: Record<string, string> = {
  "1": "ONE", "2": "TWO", "3": "THREE", "4": "FOUR", "5": "FIVE",
  "6": "SIX", "7": "SEVEN", "8": "EIGHT", "9": "NINE", "10": "TEN",
};

const VideoPlayer = ({ glossText = "" }: { glossText?: string }) => {
  const [videoUris, setVideoUris] = useState<string[]>([]); // Stores the video URIs for matched glosses
  const [loading, setLoading] = useState(true); // Tracks loading state for videos
  const [modalVisible, setModalVisible] = useState(false); // Controls the visibility of the video modal
  const [currentIndex, setCurrentIndex] = useState(0); // Keeps track of the current video index
  const [videosPreloaded, setVideosPreloaded] = useState(false); // Tracks if all videos are preloaded
  const videoRef = useRef<Video>(null); // Ref for accessing the Video component

  // useEffect hook to process the glossText and find corresponding videos
  useEffect(() => {
    let inputText = glossText.trim().toUpperCase();
  
    // Remove punctuation (.,!?)
    inputText = inputText.replace(/[.,!?]/g, '');
  
    let words = inputText.split(' ');
  
    let matchedGlosses: string[] = [];
  
    // List of untranslatable words to ignore
    const ignoredWords = new Set(["THE", "IS", "A", "AN", "OF", "AND", "TO"]);
  
    let i = 0;
    while (i < words.length) {
      let foundMatch = false;
  
      // Step 1: Check multi-word glosses
      for (let j = words.length; j > i; j--) {
        let phrase = words.slice(i, j).join(' ');
  
        // Convert Filipino phrase to English if available
        let translatedPhrase = filipinoToEnglish[phrase] || phrase;
  
        if (glossDictionary.some(item => item.gloss === translatedPhrase)) {
          matchedGlosses.push(translatedPhrase);
          i = j;
          foundMatch = true;
          break;
        }
      }
  
      // Step 2: Check single-word glosses
      if (!foundMatch) {
        let singleWord = words[i];
  
        // Convert Filipino to English if available
        let translatedWord = filipinoToEnglish[singleWord] || singleWord;
  
        if (glossDictionary.some(item => item.gloss === translatedWord)) {
          matchedGlosses.push(translatedWord);
        } else if (!ignoredWords.has(singleWord)) {
          // Step 3: Spell unknown words
          matchedGlosses.push(...singleWord.split('').map(letter => letter.toUpperCase()));
        }
  
        i++;
      }
    }
  
    // Step 4: Get video URLs for matched glosses
    const foundVideos = matchedGlosses
      .map(gloss => glossDictionary.find(item => item.gloss === gloss)?.videoUrl)
      .filter(Boolean) as string[];
  
    console.log("📝 Input Text:", glossText);
    console.log("🔍 Words Array:", words);
    console.log("🟢 Matched Glosses:", matchedGlosses);
    foundVideos.forEach((video, index) =>
      console.log(`🎥 Found Video for ${matchedGlosses[index]}: ${video}`)
    );
    console.log("🎥 Final Video List:", foundVideos);
  
    setVideoUris(foundVideos);
    setCurrentIndex(0);
    setLoading(false);
  }, [glossText]);
   // This effect runs every time the glossText changes

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

  // Function to handle when a video ends
  const handleVideoEnd = () => {
    if (currentIndex < videoUris.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      setModalVisible(false); // Close modal when all videos finish
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View style={styles.container}>
      {videoUris.length > 0 ? (
        <>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.playText}>Play Video</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Video
                ref={videoRef}
                source={{ uri: videoUris[currentIndex] }}
                style={styles.video}
                useNativeControls
                shouldPlay
                resizeMode={ResizeMode.CONTAIN}
                isMuted={true}
                isLooping={true}
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
        <Text style={styles.noteText}>No videos found for "{glossText}"</Text>
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
    backgroundColor: 'rgba(0,0,0,0.8)' 
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
  }

});

export default VideoPlayer;