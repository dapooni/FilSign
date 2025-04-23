import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Audio } from "expo-av";
import Constants from 'expo-constants';

const API_KEY = process.env.OPENAI_API_KEY;

interface SpeechToTextProps {
  isListening: boolean;
  onTranscription: (text: string) => void;
}

export default function SpeechToText({ isListening, onTranscription }: SpeechToTextProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState("");

  // Set up audio mode when the component mounts
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: 1, // DoNotMix value
          shouldDuckAndroid: true,
          interruptionModeAndroid: 1, // DoNotMix value
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
        });
        console.log("Audio mode configured successfully");
      } catch (error) {
        console.error("Error configuring audio mode:", error);
      }
    };

    configureAudio();
  }, []);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert("Please grant permission to use the microphone");
        return;
      }

      console.log("Starting recording...");
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync({
        android: {
          extension: ".mp4",
          outputFormat: Audio.RecordingOptionsPresets.HIGH_QUALITY.android.outputFormat,
          audioEncoder: Audio.RecordingOptionsPresets.HIGH_QUALITY.android.audioEncoder,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          audioQuality: Audio.RecordingOptionsPresets.HIGH_QUALITY.ios.audioQuality,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {},
      });

      await newRecording.startAsync();
      setRecording(newRecording);
      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
  
    try {
      console.log("Stopping recording...");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // Capture URI
      console.log("🎤 Recording saved at:", uri); // Log URI to check if it's valid
    
      if (!uri) {
        console.error("🚨 Error: Recording URI is undefined!");
        return;
      }
    
      sendToWhisper(uri); // Only send if URI is valid
    } catch (error) {
      console.error("Error stopping recording:", error);
    } finally {
      setRecording(null);
    }
  };
  
  const sendToWhisper = async (uri: string) => {
    console.log("📤 Sending audio file to Whisper API:", uri); 
  
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "audio.m4a", // Use .m4a for iOS recordings
      type: "audio/m4a",  // Match MIME type for iOS
    } as any);
    formData.append("model", "whisper-1");
  
    try {
      console.log("Making API request to Whisper...");
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          // Don't set Content-Type manually for FormData
        },
        body: formData,
      });
  
      const data = await response.json();
      console.log("📜 Full API Response:", JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.error("🚨 Whisper API Error:", data.error);
        return;
      }
  
      if (data.text) {
        console.log("📜 Transcription received:", data.text);
        setTranscription(data.text);
        onTranscription(data.text);
      } else {
        console.error("🚨 No transcription found in API response!");
      }
    } catch (error) {
      console.error("🚨 Whisper API Network Error:", error);
    }
  };  

  useEffect(() => {
    if (isListening) {
      startRecording();
    } else if (recording) {
      stopRecording();
    }
  }, [isListening]);

  return null;
}