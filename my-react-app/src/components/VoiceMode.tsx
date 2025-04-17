import { useState, useEffect, useRef } from "react";
// import { AiPersonality } from "@shared/schema";
import { CoachonCueScenarioAttributes } from '@/lib/schema.ts';
import {io} from 'socket.io-client';
import {AudioPlayer} from '@/lib/play/AudioPlayer.ts';
// import ChatHistoryManager from '@/lib/play/ChatHistoryManager.ts';

const API_URL = import.meta.env.VITE_API_URL;

const socket = io(API_URL);

/* eslint-disable */
let SYSTEM_PROMPT: string = "You are a friend. The user and you will engage in a spoken " +
    "dialog exchanging the transcripts of a natural real-time conversation. Keep your responses short, " +
    "generally two or three sentences for chatty scenarios.";

// let chat: any = { history: [] };
/*const chatRef: any = { current: chat };
const chatHistoryManager: any = ChatHistoryManager.getInstance(
    chatRef,
    (newChat: any) => {
      chat = { ...newChat };
      chatRef.current = chat;
      // updateChatUI();
    }
);*/


interface VoiceModeProps {
  // aiPersonality: AiPersonality;
  aiPersonality: CoachonCueScenarioAttributes['persona'];
  onSendMessage: (message: string) => void;
}

const audioPlayer: AudioPlayer = new AudioPlayer();

function stopRecording(sourceNode: MediaStreamAudioSourceNode, processor: ScriptProcessorNode) {
  console.log('stopRecording')
  // Clean up audio processing
  if (processor) {
    processor.disconnect();
    sourceNode.disconnect();
  }

  // startButton.disabled = false;
  // stopButton.disabled = true;
  // statusElement.textContent = "Processing...";
  // statusElement.className = "processing";
  console.log('processing');

  audioPlayer.stop();
  // Tell server to finalize processing
  console.log('stopAudio');
  socket.emit('stopAudio');

  // End the current turn in chat history
  // chatHistoryManager.endTurn();
}

function arrayBufferToBase64(buffer: any) {
  const binary = [];
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary.push(String.fromCharCode(bytes[i]));
  }
  return btoa(binary.join(''));
}

function base64ToFloat32Array(base64String: any) {
  try {
    const binaryString = window.atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    return float32Array;
  } catch (error) {
    console.error('Error in base64ToFloat32Array:', error);
    throw error;
  }
}

// @ts-ignore
export default function VoiceMode({ aiPersonality, onSendMessage }: VoiceModeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(true);
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const [sourceNode, setSourceNode] = useState<MediaStreamAudioSourceNode>();
  const [processor, setProcessor] = useState<ScriptProcessorNode>();
  const role = useRef(null);
  // const [progress, setProgress] = useState(66); // Mock progress for UI demonstration
  const progress = 66;

  useEffect(() => {
    (async () => {
      try {
        const _audioStream: MediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        const _audioContext = new AudioContext({
          sampleRate: 16000,
        });

        console.log('audioPlayer start component')
        await audioPlayer.start();

        setAudioContext(_audioContext);
        setAudioStream(_audioStream);
        console.log('>>>>>> audio start');
      } catch(error) {
        console.error('Error accessing microphone:', error);
        // todo: handle error
      }
    })();
  }, []);

  useEffect(() => {
    socket.on('contentStart', (data) => {
      console.log('Content start received');

      if (data.type === 'TEXT') {
        // Below update will be enabled when role is moved to the contentStart
        role.current = data.role;

        if (data.role === 'USER') {
          // When user's text content starts, hide user thinking indicator
          // hideUserThinkingIndicator();
        }
        else if (data.role === 'ASSISTANT') {
          // When assistant's text content starts, hide assistant thinking indicator
          // hideAssistantThinkingIndicator();
          let isSpeculative = false;
          try {
            if (data.additionalModelFields) {
              const additionalFields = JSON.parse(data.additionalModelFields);
              isSpeculative = additionalFields.generationStage === "SPECULATIVE";
              if (isSpeculative) {
                console.log("Received speculative content");
                // displayAssistantText = true;
              }
              else {
                // displayAssistantText = false;
              }
            }
          } catch (e) {
            console.error("Error parsing additionalModelFields:", e);
          }
        }
      }
      else if (data.type === 'AUDIO') {
        // When audio content starts, we may need to show user thinking indicator
        // if (isRecording) {
        //   showUserThinkingIndicator();
        // }
      }
    });

    // Handle text output from the server
    socket.on('textOutput', (data) => {
      console.log('Received text output', data);

      if (role.current === 'USER') {
        // When user text is received, show thinking indicator for assistant response
        // transcriptionReceived = true;
        //hideUserThinkingIndicator();

        // Add user message to chat
        // handleTextOutput({
        //   role: data.role,
        //   content: data.content
        // });

        // Show assistant thinking indicator after user text appears
        // showAssistantThinkingIndicator();
      }
      else if (role.current === 'ASSISTANT') {
        //hideAssistantThinkingIndicator();
        // if (displayAssistantText) {
        //   handleTextOutput({
        //     role: data.role,
        //     content: data.content
        //   });
        // }
      }
    });

    // Handle audio output
    socket.on('audioOutput', (data) => {
      console.log('audioOutput');
      if (data.content) {
        try {
          const audioData = base64ToFloat32Array(data.content);
          audioPlayer.playAudio(audioData);
        } catch (error) {
          console.error('Error processing audio data:', error);
        }
      }
    });

    // Handle content end events
    socket.on('contentEnd', (data) => {
      console.log('Content end received');

      if (data.type === 'TEXT') {
        if (role.current === 'USER') {
          // When user's text content ends, make sure assistant thinking is shown
          // hideUserThinkingIndicator();
          // showAssistantThinkingIndicator();
        }
        else if (role.current === 'ASSISTANT') {
          // When assistant's text content ends, prepare for user input in next turn
          // hideAssistantThinkingIndicator();
        }

        // Handle stop reasons
        if (data.stopReason && data.stopReason.toUpperCase() === 'END_TURN') {
          // chatHistoryManager!.endTurn();
        } else if (data.stopReason && data.stopReason.toUpperCase() === 'INTERRUPTED') {
          console.log("Interrupted by user");
          audioPlayer.bargeIn();
        }
      }
      else if (data.type === 'AUDIO') {
        // When audio content ends, we may need to show user thinking indicator
        // if (isRecording) {
        //   showUserThinkingIndicator();
        // }
      }
    });

    // Stream completion event
    socket.on('streamComplete', () => {
      if (isRecording) {
        stopRecording(sourceNode!, processor!);
        setIsRecording(false);
      }
      // statusElement.textContent = "Ready";
      // statusElement.className = "ready";
    });

    // Handle connection status updates
    socket.on('connect', () => {
      console.log('socket connect');
      // statusElement.textContent = "Connected to server";
      // statusElement.className = "connected";
      setSessionInitialized(false);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnect');

      // statusElement.textContent = "Disconnected from server";
      // statusElement.className = "disconnected";
      // startButton.disabled = true;
      // stopButton.disabled = true;
      setSessionInitialized(false);

      // hideUserThinkingIndicator();
      // hideAssistantThinkingIndicator();
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error("Server error:", error);
      // statusElement.textContent = "Error: " + (error.message || JSON.stringify(error).substring(0, 100));
      // statusElement.className = "error";
      // hideUserThinkingIndicator();
      // hideAssistantThinkingIndicator();
    });
  }, []);

  useEffect(() => {
    if(!audioStream || !audioContext) {
      return;
    }

    console.log('isRecording', isRecording);

    if(isRecording) {
        try {
          if (!sessionInitialized) {
            try {
              // Send events in sequence
              console.log('promptStart');
              socket.emit('promptStart');
              console.log('systemPrompt', SYSTEM_PROMPT);
              socket.emit('systemPrompt', SYSTEM_PROMPT);
              console.log('audioStart');
              socket.emit('audioStart');

              // Mark session as initialized
              setSessionInitialized(true);
              // statusElement.textContent = "Session initialized successfully";
              console.log('Session initialized successfully');
            } catch (error) {
              console.error("Failed to initialize session:", error);
              // statusElement.textContent = "Error initializing session";
              // statusElement.className = "error";
            }
          }

          const sourceNode = audioContext.createMediaStreamSource(audioStream);

          setSourceNode(sourceNode);

          if (audioContext.createScriptProcessor) {
            const processor = audioContext.createScriptProcessor(512, 1, 1);

            processor.onaudioprocess = (e: any) => {
              // if (!isRecording) return;

              const inputData = e.inputBuffer.getChannelData(0);

              // Convert to 16-bit PCM
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }

              // Convert to base64 (browser-safe way)
              const base64Data = arrayBufferToBase64(pcmData.buffer);

              // Send to server
              socket.emit('audioInput', base64Data);
            };

            sourceNode.connect(processor);
            processor.connect(audioContext.destination);

            setProcessor(processor);
          }

          // setIsRecording(true);
          // isRecording = true;
          // startButton.disabled = true;
          // stopButton.disabled = false;
          // statusElement.textContent = "Streaming... Speak now";
          // statusElement.className = "recording";
          console.log('Streaming... Speak now')

          // Show user thinking indicator when starting to record
          // transcriptionReceived = false;
          // showUserThinkingIndicator();

        } catch (error) {
          console.error("Error starting recording:", error);
          // statusElement.textContent = "Error: " + error.message;
          // statusElement.className = "error";
        }

    } else {
      stopRecording(sourceNode!, processor!);
    }
  }, [isRecording])



  const toggleRecording = () => {
    const newRecordingState = !isRecording;
    setIsRecording(newRecordingState);

    if (!newRecordingState) {
      // Simulate sending a voice message when recording stops
      // onSendMessage("Voice message placeholder");

      // Simulate AI speaking in response
      setAiSpeaking(true);
      setTimeout(() => {
        setAiSpeaking(false);
      }, 3000);
    }
  };

  const fallbackAvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200";

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
          <img
            src={aiPersonality.avatarUrl || fallbackAvatarUrl}
            alt={`${aiPersonality.name} avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-medium mb-1">{aiPersonality.name}</h3>
        <p className="text-neutral-500 text-sm mb-4">{aiPersonality.role}</p>

        <div className="text-neutral-600 mb-8">
          {aiSpeaking && (
            <>
              <div className="mb-2">AI is speaking...</div>
              <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={toggleRecording}
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-md cursor-pointer ${
            isRecording 
              ? "bg-red-500" 
              : "bg-primary pulse"
          }`}
        >
          {isRecording ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <rect width="4" height="16" x="6" y="4" rx="1" />
              <rect width="4" height="16" x="14" y="4" rx="1" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          )}
        </button>
        <p className="text-sm text-neutral-500 mt-3">
          {isRecording ? "Tap to stop" : "Tap to speak"}
        </p>
      </div>
    </div>
  );
}
