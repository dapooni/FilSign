import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import glossDictionary from '../constants/glossDictionary';

const numberToGloss: Record<string, string> = {
  "1": "ONE",
  "2": "TWO",
  "3": "THREE",
  "4": "FOUR",
  "5": "FIVE",
  "6": "SIX",
  "7": "SEVEN",
  "8": "EIGHT",
  "9": "NINE",
  "10": "TEN",
};

const VideoPlayer = ({ glossText }: { glossText: string }) => {
  const [videoUris, setVideoUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    let inputText = glossText.trim().toUpperCase();
    let words = inputText.split(' ');
  
    let matchedGlosses: string[] = [];
  
    // Step 1: Prioritize multi-word glosses first
    let i = 0;
    while (i < words.length) {
      let foundMatch = false;
  
      // Check for longest possible match (e.g., "GOOD MORNING" instead of "GOOD" and "MORNING")
      for (let j = words.length; j > i; j--) {
        let phrase = words.slice(i, j).join(' ');
  
        if (glossDictionary.some(item => item.gloss === phrase)) {
          matchedGlosses.push(phrase);
          i = j; // Move the index forward
          foundMatch = true;
          break;
        }
      }
  
      // If no multi-word match, fallback to single word
      if (!foundMatch) {
        matchedGlosses.push(numberToGloss[words[i]] || words[i]);
        i++;
      }
    }
  
    // Step 2: Get video URLs for matched glosses
    const foundVideos = matchedGlosses
      .map(gloss => glossDictionary.find(item => item.gloss === gloss)?.videoUrl)
      .filter(Boolean) as string[];
  
    setVideoUris(foundVideos);
    setCurrentIndex(0);
    setLoading(false);
  }, [glossText]);
  

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
  container: { alignItems: 'center', marginTop: 20 },
  playText: { fontSize: 18, color: 'blue', textDecorationLine: 'underline' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  video: { width: '90%', height: '50%' },
  closeText: { marginTop: 10, fontSize: 18, color: 'white', textDecorationLine: 'underline' },
});

export default VideoPlayer;
