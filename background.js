// Background service worker handles recording and API calls
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let offscreenDocument = null;

// Debug logging system
const DEBUG = true; // Set to false in production

function debugLog(context, message, data = null) {
  if (!DEBUG) return;
  
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${context}] ${message}`;
  
  if (data) {
    console.log(logMessage, data);
  } else {
    console.log(logMessage);
  }
  
  // Save to chrome.storage.local for persistence
  chrome.storage.local.get(['debugLogs'], (result) => {
    const logs = result.debugLogs || [];
    logs.push({ timestamp, context, message, data: data ? JSON.stringify(data) : null });
    // Keep only last 100 logs
    if (logs.length > 100) logs.shift();
    chrome.storage.local.set({ debugLogs: logs });
  });
}

// Log extension startup
debugLog('INIT', 'Extension background script loaded');
chrome.runtime.getPlatformInfo((info) => {
  debugLog('INIT', 'Platform info', info);
});

// Check if offscreen document exists
async function hasOffscreenDocument() {
  debugLog('OFFSCREEN', 'Checking if offscreen document exists');
  
  // Check Chrome version first
  const manifest = chrome.runtime.getManifest();
  debugLog('OFFSCREEN', 'Manifest version', manifest.minimum_chrome_version);
  
  if ('getContexts' in chrome.runtime) {
    try {
      const contexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [chrome.runtime.getURL('offscreen.html')]
      });
      debugLog('OFFSCREEN', `Found ${contexts.length} offscreen contexts`);
      return contexts.length > 0;
    } catch (error) {
      debugLog('OFFSCREEN', 'getContexts error', error.message);
      return false;
    }
  } else {
    debugLog('OFFSCREEN', 'getContexts API not available - Chrome too old');
    return false;
  }
}

// Create offscreen document if it doesn't exist
async function ensureOffscreenDocument() {
  debugLog('OFFSCREEN', 'Ensuring offscreen document exists');
  
  try {
    const exists = await hasOffscreenDocument();
    
    if (!exists) {
      debugLog('OFFSCREEN', 'Creating new offscreen document');
      
      // Check permissions first
      const permissions = await chrome.permissions.getAll();
      debugLog('PERMISSIONS', 'Current permissions', permissions);
      
      await chrome.offscreen.createDocument({
        url: chrome.runtime.getURL('offscreen.html'),
        reasons: ['USER_MEDIA'],
        justification: 'Recording audio for voice dictation'
      });
      
      debugLog('OFFSCREEN', 'Offscreen document created successfully');
      
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify it was created
      const verifyExists = await hasOffscreenDocument();
      debugLog('OFFSCREEN', 'Verification after creation', { exists: verifyExists });
    } else {
      debugLog('OFFSCREEN', 'Offscreen document already exists');
    }
  } catch (error) {
    debugLog('OFFSCREEN', 'Error ensuring offscreen document', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (!error.message.includes('Only a single offscreen document may be created')) {
      throw error;
    }
  }
}

// Listen for keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'start-dictation') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'startDictation'});
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  debugLog('MESSAGE', 'Received message', { 
    action: request.action, 
    from: sender.tab?.id || sender.url || 'unknown',
    hasCallback: typeof sendResponse === 'function'
  });
  
  if (request.action === 'startRecording') {
    startRecording(sender.tab, sendResponse);
    return true; // Keep channel open for async response
  } else if (request.action === 'stopRecording') {
    stopRecording();
  } else if (request.action === 'recordingComplete') {
    // Handle audio data from offscreen document
    if (request.error) {
      // Handle error from offscreen document
      if (chrome.runtime.sendResponseProxy) {
        chrome.runtime.sendResponseProxy({success: false, error: request.error});
        chrome.runtime.sendResponseProxy = null;
      }
    } else {
      handleRecordingComplete(request.audioData, request.appName);
    }
  } else if (request.action === 'getDebugLogs') {
    // Add new debug action
    chrome.storage.local.get(['debugLogs'], (result) => {
      sendResponse(result.debugLogs || []);
    });
    return true;
  }
});

async function startRecording(tab, sendResponse) {
  debugLog('RECORDING', 'Starting recording', { 
    tabId: tab?.id, 
    url: tab?.url,
    title: tab?.title 
  });
  
  try {
    // Check Chrome management status
    if (chrome.management && chrome.management.getSelf) {
      const extensionInfo = await chrome.management.getSelf();
      debugLog('MANAGEMENT', 'Extension info', extensionInfo);
    }
    
    // Check permissions
    const permissions = await chrome.permissions.getAll();
    debugLog('PERMISSIONS', 'Available permissions before recording', permissions);
    
    // Detect app
    const appName = detectApp(tab.url, tab.title);
    debugLog('RECORDING', 'Detected app', appName);
    
    // Ensure offscreen document
    await ensureOffscreenDocument();
    
    // Store sendResponse callback
    chrome.runtime.sendResponseProxy = sendResponse;
    
    // Create a unique ID for this recording session
    const sessionId = Date.now().toString();
    debugLog('RECORDING', 'Starting session', sessionId);
    
    // Send message with timeout
    let messageReceived = false;
    
    const sendPromise = chrome.runtime.sendMessage({
      action: 'startOffscreenRecording',
      appName: appName,
      sessionId: sessionId
    }).then(() => {
      messageReceived = true;
      debugLog('RECORDING', 'Message sent to offscreen document');
    }).catch(error => {
      debugLog('RECORDING', 'Failed to send message to offscreen', error.message);
    });
    
    // Set timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        if (!messageReceived) {
          reject(new Error('Offscreen document did not respond within 5 seconds'));
        }
      }, 5000);
    });
    
    await Promise.race([sendPromise, timeoutPromise]);
    
    isRecording = true;
    
    // Update badge
    chrome.action.setBadgeText({text: 'REC'});
    chrome.action.setBadgeBackgroundColor({color: '#FF0000'});
    
    // Auto-stop timeout
    setTimeout(() => {
      if (isRecording) {
        debugLog('RECORDING', 'Auto-stopping after 30 seconds');
        stopRecording();
      }
    }, 30000);
    
  } catch (error) {
    debugLog('RECORDING', 'Recording error', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    sendResponse({
      success: false, 
      error: error.message,
      debugInfo: {
        timestamp: new Date().toISOString(),
        context: 'startRecording',
        error: error.stack
      }
    });
  }
}

function stopRecording() {
  if (isRecording) {
    // Send stop message to offscreen document
    chrome.runtime.sendMessage({action: 'stopOffscreenRecording'});
    isRecording = false;
    chrome.action.setBadgeText({text: ''});
  }
}

async function handleRecordingComplete(audioData, appName) {
  try {
    // Check if we have audio data
    if (!audioData) {
      throw new Error('No audio data received from recording');
    }
    
    // Convert base64 to blob
    const audioBlob = base64ToBlob(audioData, 'audio/webm');
    
    // Process the audio
    const result = await processAudio(audioBlob, appName);
    
    // Use the stored sendResponse callback
    if (chrome.runtime.sendResponseProxy) {
      chrome.runtime.sendResponseProxy({success: true, text: result});
      chrome.runtime.sendResponseProxy = null;
    }
  } catch (error) {
    console.error('handleRecordingComplete error:', error);
    if (chrome.runtime.sendResponseProxy) {
      chrome.runtime.sendResponseProxy({success: false, error: error.message});
      chrome.runtime.sendResponseProxy = null;
    }
  }
}

function base64ToBlob(base64Data, contentType) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, {type: contentType});
}

function detectApp(url, title) {
  const domain = new URL(url).hostname;
  
  // Detect common web apps
  if (domain.includes('google.com') && !domain.includes('mail.google.com')) return 'Google Search';
  if (domain.includes('gmail.com') || domain.includes('mail.google.com')) return 'Gmail';
  if (domain.includes('slack.com')) return 'Slack';
  if (domain.includes('discord.com')) return 'Discord';
  if (domain.includes('twitter.com') || domain.includes('x.com')) return 'Twitter';
  if (domain.includes('linkedin.com')) return 'LinkedIn';
  if (domain.includes('facebook.com')) return 'Facebook';
  if (domain.includes('docs.google.com')) return 'Google Docs';
  if (domain.includes('github.com')) return 'GitHub';
  if (domain.includes('reddit.com')) return 'Reddit';
  if (domain.includes('notion.so')) return 'Notion';
  if (domain.includes('figma.com')) return 'Figma';
  if (domain.includes('jira.') || domain.includes('atlassian.')) return 'Jira';
  if (domain.includes('asana.com')) return 'Asana';
  if (domain.includes('trello.com')) return 'Trello';
  if (domain.includes('colab.research.google.com')) return 'Code editors';
  if (domain.includes('replit.com')) return 'Code editors';
  if (domain.includes('codepen.io')) return 'Code editors';
  if (domain.includes('keep.google.com')) return 'Notes';
  if (domain.includes('evernote.com')) return 'Notes';
  if (domain.includes('onenote.')) return 'Notes';
  
  // Default to generic web
  return 'Web';
}

async function processAudio(audioBlob, appName) {
  // Get API key from storage
  const storage = await chrome.storage.sync.get(['groqApiKey', 'model', 'customModel']);
  const apiKey = storage.groqApiKey;
  let model = storage.model || 'meta-llama/Llama-4-Scout-17B-16E-Instruct';
  
  // Use custom model if selected
  if (model === 'custom' && storage.customModel) {
    model = storage.customModel;
  }
  
  if (!apiKey) {
    throw new Error('Please set your Groq API key in the extension settings');
  }
  
  // Step 1: Transcribe with Whisper
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('response_format', 'json');
  
  const whisperResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: formData
  });
  
  if (!whisperResponse.ok) {
    const errorText = await whisperResponse.text();
    console.error('Whisper API error:', errorText);
    throw new Error('Transcription failed. Please check your API key and try again.');
  }
  
  const transcription = await whisperResponse.json();
  const rawText = transcription.text;
  
  if (!rawText || rawText.trim() === '') {
    throw new Error('No speech detected. Please speak clearly and try again.');
  }
  
  // Step 2: Format with LLM
  const systemPrompt = `You are a writing assistant. The user is dictating text for ${appName}. Adjust style based on app:

Google Search: Clear, concise search query
Slack/Discord: Casual, friendly
Gmail/Email: Professional, formal
Notes: Clear, organized
Code editors: Technical, precise

Fix grammar and spelling and remove filler words or duplications. Format nicely. Match the app's style. Output only corrected, well formated text.`;
  
  const llmResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: rawText
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })
  });
  
  if (!llmResponse.ok) {
    const errorText = await llmResponse.text();
    console.error('LLM API error:', errorText);
    // If LLM fails, return the raw transcription
    console.log('Falling back to raw transcription');
    return rawText;
  }
  
  const llmResult = await llmResponse.json();
  
  if (!llmResult.choices || !llmResult.choices[0]) {
    console.error('Invalid LLM response:', llmResult);
    return rawText;
  }
  
  const formattedText = llmResult.choices[0].message.content.trim();
  
  return formattedText || rawText; // Fallback to raw text if formatting is empty
}

// Listen for popup/tab actions to stop recording
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup') {
    port.onMessage.addListener((msg) => {
      if (msg.action === 'stopRecording') {
        stopRecording();
      }
    });
  }
});