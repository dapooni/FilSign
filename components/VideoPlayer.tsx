import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import glossDictionary from '../constants/glossDictionary';
import { filipinoToEnglish } from '../constants/filipinoToEnglish';

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
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.😎' },
  video: { width: '90%', height: '50%' },
  closeText: { marginTop: 10, fontSize: 18, color: 'white', textDecorationLine: 'underline' },
});

export default VideoPlayer;