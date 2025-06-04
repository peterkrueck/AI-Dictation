// Offscreen document handles audio recording with access to mediaDevices
let mediaRecorder = null;
let audioChunks = [];
let currentAppName = null;
let currentUrl = null;

console.log('[Offscreen] Document loaded at', new Date().toISOString());

// Enhanced error logging
function logError(context, error) {
  console.error(`[Offscreen] [${context}]`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startOffscreenRecording') {
    startRecording(request.appName, request.currentUrl);
  } else if (request.action === 'stopOffscreenRecording') {
    stopRecording();
  }
});

async function startRecording(appName, url) {
  console.log('[Offscreen] Starting recording for app:', appName, 'URL:', url);
  
  try {
    currentAppName = appName;
    currentUrl = url;
    
    // Check if mediaDevices is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('MediaDevices API not available');
    }
    
    console.log('[Offscreen] Requesting microphone permission...');
    
    // Add permission query if available
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const micPermission = await navigator.permissions.query({ name: 'microphone' });
        console.log('[Offscreen] Microphone permission state:', micPermission.state);
        
        micPermission.addEventListener('change', () => {
          console.log('[Offscreen] Microphone permission changed to:', micPermission.state);
        });
      } catch (permError) {
        console.log('[Offscreen] Cannot query permission (normal on some browsers)');
      }
    }
    
    // Request microphone with timeout
    const streamPromise = navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100
      } 
    });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Microphone access timeout after 10 seconds')), 10000)
    );
    
    const stream = await Promise.race([streamPromise, timeoutPromise]);
    
    console.log('[Offscreen] Microphone access granted. Stream active:', stream.active);
    console.log('[Offscreen] Audio tracks:', stream.getAudioTracks().length);
    
    // Set up MediaRecorder
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg'
    ];
    
    let selectedMimeType = '';
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        break;
      }
    }
    
    console.log('[Offscreen] Selected MIME type:', selectedMimeType);
    
    if (!selectedMimeType) {
      throw new Error('No supported audio MIME type found');
    }
    
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: selectedMimeType,
      audioBitsPerSecond: 128000
    });
    
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      console.log('[Offscreen] Data available:', event.data.size, 'bytes');
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = async () => {
      console.log('[Offscreen] Recording stopped. Total chunks:', audioChunks.length);
      
      try {
        const audioBlob = new Blob(audioChunks, { type: selectedMimeType });
        console.log('[Offscreen] Created blob:', audioBlob.size, 'bytes');
        
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('[Offscreen] Stopped track:', track.label);
        });
        
        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result.split(',')[1];
          console.log('[Offscreen] Sending audio data. Base64 length:', base64Data.length);
          
          chrome.runtime.sendMessage({
            action: 'recordingComplete',
            audioData: base64Data,
            appName: currentAppName,
            currentUrl: currentUrl,
            mimeType: selectedMimeType,
            duration: audioChunks.length
          });
        };
        reader.onerror = (error) => {
          logError('FileReader', error);
          chrome.runtime.sendMessage({
            action: 'recordingComplete',
            error: 'Failed to read audio data: ' + error.message
          });
        };
        reader.readAsDataURL(audioBlob);
      } catch (error) {
        logError('Processing recording', error);
        chrome.runtime.sendMessage({
          action: 'recordingComplete',
          error: 'Failed to process recording: ' + error.message
        });
      }
    };
    
    mediaRecorder.onerror = (event) => {
      logError('MediaRecorder', event.error);
      chrome.runtime.sendMessage({
        action: 'recordingComplete',
        error: 'MediaRecorder error: ' + event.error.message
      });
    };
    
    mediaRecorder.start(1000); // Collect data every second
    console.log('[Offscreen] MediaRecorder started. State:', mediaRecorder.state);
    
  } catch (error) {
    logError('startRecording', error);
    
    // Detailed error message
    let detailedError = error.message;
    if (error.name === 'NotAllowedError') {
      detailedError = 'Microphone permission denied. Please allow microphone access in Chrome settings.';
    } else if (error.name === 'NotFoundError') {
      detailedError = 'No microphone found. Please check your audio input devices.';
    } else if (error.name === 'NotReadableError') {
      detailedError = 'Microphone is being used by another application.';
    }
    
    chrome.runtime.sendMessage({
      action: 'recordingComplete',
      error: detailedError,
      errorDetails: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}