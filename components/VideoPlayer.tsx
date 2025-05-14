import React, { useEffect, useState, useRef } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, Image, StyleSheet,} from 'react-native';
import glossDictionary from '../constants/glossDictionary';
import { filipinoToEnglish } from '../constants/filipinoToEnglish';
import { Video } from 'expo-av';

type Props = {
  glossText: string;
  onPlayPress: () => void;
  setVideoUris: (uris: string[]) => void;
};

const VideoPlayer = ({ glossText, onPlayPress, setVideoUris }: Props) => {
  const [loading, setLoading] = useState(true);
  const [videoUris, setLocalVideoUris] = useState<string[]>([]);
  const [matchedGlosses, setMatchedGlosses] = useState<string[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [videosPreloaded, setVideosPreloaded] = useState(false);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const processGlossText = () => {
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

          if (
            typeof translatedPhrase === 'string' &&
            glossDictionary.some(
              item => item.gloss.toUpperCase() === translatedPhrase.toUpperCase()
            )
          ) {
            matchedGlosses.push(translatedPhrase.toUpperCase());
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

      setMatchedGlosses(matchedGlosses);

      const foundVideos = matchedGlosses
        .map(gloss =>
          glossDictionary.find(
            item => item.gloss.toUpperCase() === gloss.toUpperCase()
          )?.videoUrl
        )
        .filter(Boolean) as string[];
      
      setLocalVideoUris(foundVideos); // local use
      setVideoUris(foundVideos);
      setLoading(false);
    };

    processGlossText();
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

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View>
      {videoUris.length > 0 ? (
        <TouchableOpacity
          onPress={() => {
            setIsPressed(true);
            onPlayPress();
          }}
          style={styles.playButton}
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
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  playButton: { 
    position: 'absolute',
    bottom: -70,
    right: -5,
  },
  playIcon: {
    width: 40,
    height: 40,
  },
  buttonIcon:{
    width: 45,
    height: 45,
  },
});

export default VideoPlayer;