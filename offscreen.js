// Offscreen document handles audio recording with access to mediaDevices
let mediaRecorder = null;
let audioChunks = [];
let currentAppName = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startOffscreenRecording') {
    startRecording(request.appName);
  } else if (request.action === 'stopOffscreenRecording') {
    stopRecording();
  }
});

async function startRecording(appName) {
  try {
    currentAppName = appName;
    
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    });
    
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      stream.getTracks().forEach(track => track.stop());
      
      // Convert blob to base64 to send back to background script
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        
        // Send audio data back to background script
        chrome.runtime.sendMessage({
          action: 'recordingComplete',
          audioData: base64Data,
          appName: currentAppName
        });
      };
      reader.readAsDataURL(audioBlob);
    };
    
    mediaRecorder.start();
  } catch (error) {
    console.error('Offscreen recording error:', error);
    chrome.runtime.sendMessage({
      action: 'recordingComplete',
      error: error.message
    });
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}