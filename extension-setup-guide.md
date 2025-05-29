# Voice Dictation Chrome Extension - Manual Setup

## Option 1: Quick Setup with VS Code

### Step 1: Create Project Folder
1. Create a new folder called `voice-dictation-extension`
2. Open it in VS Code

### Step 2: Create Files
Create these files in your folder:

#### 📄 manifest.json
```json
{
  "manifest_version": 3,
  "name": "AI Voice Dictation",
  "version": "1.0",
  "description": "Intelligent voice dictation with Groq AI",
  "permissions": [
    "activeTab",
    "storage",
    "scripting"
  ],
  "host_permissions": [
    "https://api.groq.com/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "commands": {
    "start-dictation": {
      "suggested_key": {
        "default": "Ctrl+Shift+1",
        "chromeos": "Ctrl+Shift+1"
      },
      "description": "Start voice dictation"
    }
  },
  "options_page": "config.html"
}
```

#### 📄 background.js
```javascript
// Background service worker handles recording and API calls
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];

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
  if (request.action === 'startRecording') {
    startRecording(sender.tab, sendResponse);
    return true; // Keep channel open for async response
  }
});

async function startRecording(tab, sendResponse) {
  try {
    // Check for microphone permission first
    const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
    if (permissionStatus.state === 'denied') {
      sendResponse({success: false, error: 'Microphone access denied. Please allow microphone access in Chrome settings.'});
      return;
    }
    
    // Get the current tab's title to detect the app/site
    const appName = detectApp(tab.url, tab.title);
    
    // Start recording
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
      
      // Process the audio
      try {
        const result = await processAudio(audioBlob, appName);
        sendResponse({success: true, text: result});
      } catch (error) {
        sendResponse({success: false, error: error.message});
      }
    };
    
    mediaRecorder.start();
    isRecording = true;
    
    // Show recording indicator
    chrome.action.setBadgeText({text: 'REC'});
    chrome.action.setBadgeBackgroundColor({color: '#FF0000'});
    
    // Stop recording after 30 seconds max
    setTimeout(() => {
      if (isRecording) {
        stopRecording();
      }
    }, 30000);
    
  } catch (error) {
    console.error('Recording error:', error);
    sendResponse({success: false, error: error.message});
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    chrome.action.setBadgeText({text: ''});
  }
}

function detectApp(url, title) {
  const domain = new URL(url).hostname;
  
  // Detect common web apps
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
  const storage = await chrome.storage.sync.get(['groqApiKey', 'model']);
  const apiKey = storage.groqApiKey;
  const model = storage.model || 'meta-llama/Llama-4-Scout-17B-16E-Instruct';
  
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
```

#### 📄 content.js
```javascript
// Content script runs in web pages and handles text insertion
let recordingIndicator = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startDictation') {
    startDictation();
  }
});

function startDictation() {
  // Get the currently focused element
  const activeElement = document.activeElement;
  
  // Check if it's a text input field
  if (!isTextInput(activeElement)) {
    showNotification('Please click in a text field first', 'error');
    return;
  }
  
  // Show recording indicator
  showRecordingIndicator();
  
  // Request recording from background script
  chrome.runtime.sendMessage({action: 'startRecording'}, (response) => {
    hideRecordingIndicator();
    
    if (response.success) {
      insertText(activeElement, response.text);
      showNotification('Dictation complete!', 'success');
    } else {
      showNotification('Error: ' + response.error, 'error');
    }
  });
}

function isTextInput(element) {
  const tagName = element.tagName.toLowerCase();
  
  // Check for standard input elements
  if (tagName === 'textarea') return true;
  if (tagName === 'input') {
    const type = element.type.toLowerCase();
    return ['text', 'email', 'search', 'url', 'tel', 'password'].includes(type);
  }
  
  // Check for contenteditable elements
  if (element.contentEditable === 'true') return true;
  
  // Check for common WYSIWYG editors
  if (element.classList.contains('ql-editor') || // Quill
      element.classList.contains('trix-content') || // Trix
      element.classList.contains('ProseMirror') || // ProseMirror
      element.classList.contains('editable') || // Generic
      element.getAttribute('role') === 'textbox') {
    return true;
  }
  
  return false;
}

function insertText(element, text) {
  // Save current selection
  const start = element.selectionStart;
  const end = element.selectionEnd;
  
  if (element.tagName.toLowerCase() === 'textarea' || 
      element.tagName.toLowerCase() === 'input') {
    // Standard input/textarea
    const currentValue = element.value;
    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
    
    element.value = newValue;
    element.selectionStart = element.selectionEnd = start + text.length;
    
    // Trigger input event for frameworks
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // ContentEditable or other rich text
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // Move cursor to end of inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  // Focus the element
  element.focus();
}

function showRecordingIndicator() {
  recordingIndicator = document.createElement('div');
  recordingIndicator.id = 'voice-dictation-indicator';
  recordingIndicator.innerHTML = `
    <div class="recording-dot"></div>
    <span>Recording... Press Enter/Esc or click to stop</span>
  `;
  recordingIndicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #FF4444;
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    cursor: pointer;
    z-index: 999999;
  `;
  
  const dot = recordingIndicator.querySelector('.recording-dot');
  dot.style.cssText = `
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  const stopRecordingAndHide = () => {
    chrome.runtime.sendMessage({action: 'stopRecording'});
    hideRecordingIndicator();
  };
  
  recordingIndicator.onclick = stopRecordingAndHide;
  
  // Add keyboard listener for Esc and Enter
  const keyboardHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      stopRecordingAndHide();
      document.removeEventListener('keydown', keyboardHandler, true);
    }
  };
  
  // Add keyboard listener with capture to ensure we get the event first
  document.addEventListener('keydown', keyboardHandler, true);
  
  // Store the handler so we can remove it
  recordingIndicator.keyboardHandler = keyboardHandler;
  
  document.body.appendChild(recordingIndicator);
  
  // Focus on the indicator for accessibility
  recordingIndicator.tabIndex = -1;
  recordingIndicator.focus();
}

function hideRecordingIndicator() {
  if (recordingIndicator) {
    // Remove keyboard listener if it exists
    if (recordingIndicator.keyboardHandler) {
      document.removeEventListener('keydown', recordingIndicator.keyboardHandler, true);
    }
    recordingIndicator.remove();
    recordingIndicator = null;
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#FF4444' : '#44BB44'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 999999;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add slide animations
const animStyle = document.createElement('style');
animStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(animStyle);
```

#### 📄 popup.html
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="popup-container">
    <h2>🎤 AI Voice Dictation</h2>
    
    <div id="status" class="status">
      <span class="status-dot"></span>
      <span id="status-text">Ready</span>
    </div>
    
    <button id="dictate-btn" class="dictate-btn">
      Start Dictation
      <span class="shortcut">Ctrl+Shift+1</span>
    </button>
    
    <div class="settings-link">
      <a href="#" id="settings-link">⚙️ Settings</a>
    </div>
    
    <div class="tips">
      <p><strong>Tips:</strong></p>
      <ul>
        <li>Click in any text field</li>
        <li>Press Ctrl+Shift+1 or click button</li>
        <li>Speak clearly</li>
        <li>Press Enter/Esc or click to stop</li>
      </ul>
    </div>
  </div>
  
  <script src="popup.js"></script>
</body>
</html>
```

#### 📄 popup.js
```javascript
// Popup script handles UI interactions

document.addEventListener('DOMContentLoaded', () => {
  const dictateBtn = document.getElementById('dictate-btn');
  const settingsLink = document.getElementById('settings-link');
  const statusText = document.getElementById('status-text');
  const statusDot = document.querySelector('.status-dot');
  
  // Check if API key is set
  chrome.storage.sync.get(['groqApiKey'], (result) => {
    if (!result.groqApiKey) {
      statusText.textContent = 'API key not set';
      statusDot.style.backgroundColor = '#FF4444';
      dictateBtn.disabled = true;
    } else {
      statusText.textContent = 'Ready';
      statusDot.style.backgroundColor = '#44BB44';
    }
  });
  
  // Handle dictation button click
  dictateBtn.addEventListener('click', () => {
    // Get active tab and start dictation
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'startDictation'});
      window.close();
    });
  });
  
  // Handle settings link
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});
```

#### 📄 config.html
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AI Voice Dictation Settings</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="config-container">
    <h1>🎤 AI Voice Dictation Settings</h1>
    
    <div class="config-section">
      <h2>Groq API Configuration</h2>
      
      <div class="form-group">
        <label for="api-key">Groq API Key:</label>
        <input type="password" id="api-key" placeholder="gsk_..." />
        <small>Get your API key from <a href="https://console.groq.com" target="_blank">console.groq.com</a></small>
      </div>
      
      <div class="form-group">
        <label for="model">LLM Model:</label>
        <select id="model">
          <option value="meta-llama/Llama-4-Scout-17B-16E-Instruct">Llama 4 Scout 17B (Recommended)</option>
          <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
          <option value="llama-3.1-70b-versatile">Llama 3.1 70B Versatile</option>
          <option value="llama3-70b-8192">Llama 3 70B</option>
          <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
          <option value="gemma2-9b-it">Gemma 2 9B</option>
        </select>
        <small>Llama 4 Scout provides the best balance of speed and quality</small>
      </div>
      
      <button id="save-btn" class="save-btn">Save Settings</button>
      <div id="save-status" class="save-status"></div>
    </div>
    
    <div class="config-section">
      <h2>Keyboard Shortcut</h2>
      <p>Current shortcut: <strong>Ctrl+Shift+1</strong> (on Chromebook)</p>
      <p><small>Note: This matches your Mac's Cmd+Shift+1, but uses Ctrl on Chromebook</small></p>
      <p>To change: Go to chrome://extensions/shortcuts</p>
      <p><small>💡 Tip: While recording, press Enter or Esc to stop</small></p>
    </div>
    
    <div class="config-section">
      <h2>Sync Across Devices</h2>
      <p>✅ This extension automatically syncs settings across all Chromebooks logged into your Google account.</p>
      <p>Your API key and preferences will be available on all your devices!</p>
    </div>
    
    <div class="config-section">
      <h2>How to Use</h2>
      <ol>
        <li>Click in any text field on a website</li>
        <li>Press <strong>Ctrl+Shift+1</strong> (or click extension icon)</li>
        <li>Speak your message clearly</li>
        <li>Press <strong>Enter</strong> or <strong>Esc</strong> to stop (or click the red indicator)</li>
        <li>Your formatted text will appear automatically</li>
      </ol>
      
      <h3>New Features:</h3>
      <ul>
        <li>✨ <strong>Filler word removal</strong> - "um", "uh", duplications are automatically removed</li>
        <li>📝 <strong>Smart formatting</strong> - Text is nicely formatted based on context</li>
        <li>⌨️ <strong>Quick stop</strong> - Press Enter or Esc while recording</li>
        <li>🔄 <strong>Auto-sync</strong> - Settings sync across all your Chromebooks</li>
      </ul>
    </div>
    
    <div class="config-section">
      <h2>Supported Sites</h2>
      <p>The extension adapts its writing style for:</p>
      <ul>
        <li><strong>Email</strong> - Gmail: Professional, formal tone</li>
        <li><strong>Chat</strong> - Slack, Discord: Casual, friendly style</li>
        <li><strong>Social</strong> - LinkedIn, Twitter/X, Facebook, Reddit: Platform-appropriate</li>
        <li><strong>Docs</strong> - Google Docs: Well-structured writing</li>
        <li><strong>Notes</strong> - Google Keep, Evernote, OneNote: Clear, organized</li>
        <li><strong>Code</strong> - GitHub, Colab, Replit, CodePen: Technical, precise</li>
        <li><strong>Work</strong> - Jira, Asana, Trello, Notion, Figma: Professional</li>
        <li><strong>Any other website</strong> - Standard, clear writing</li>
      </ul>
    </div>
    
    <div class="config-section">
      <h2>About</h2>
      <p><strong>Version:</strong> 1.0</p>
      <p><strong>Model:</strong> Using Groq's latest Llama 4 Scout 17B model</p>
      <p><strong>Privacy:</strong> All processing is done via direct API calls. No data is stored.</p>
      <p><small>Made with ❤️ for Dad's Chromebook</small></p>
    </div>
  </div>
  
  <script src="config.js"></script>
</body>
</html>
```

#### 📄 config.js
```javascript
// Configuration page script

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('api-key');
  const modelSelect = document.getElementById('model');
  const saveBtn = document.getElementById('save-btn');
  const saveStatus = document.getElementById('save-status');
  
  // Load existing settings
  chrome.storage.sync.get(['groqApiKey', 'model'], (result) => {
    if (result.groqApiKey) {
      apiKeyInput.value = result.groqApiKey;
    }
    if (result.model) {
      modelSelect.value = result.model;
    }
  });
  
  // Save settings
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;
    
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }
    
    if (!apiKey.startsWith('gsk_')) {
      showStatus('API key should start with gsk_', 'error');
      return;
    }
    
    chrome.storage.sync.set({
      groqApiKey: apiKey,
      model: model
    }, () => {
      showStatus('Settings saved successfully!', 'success');
      // Sync storage to ensure it's available on all devices
      chrome.storage.sync.getBytesInUse(null, (bytesInUse) => {
        console.log('Settings synced, using ' + bytesInUse + ' bytes');
      });
    });
  });
  
  function showStatus(message, type) {
    saveStatus.textContent = message;
    saveStatus.className = `save-status ${type}`;
    saveStatus.style.display = 'block';
    
    setTimeout(() => {
      saveStatus.style.display = 'none';
    }, 3000);
  }
});
```

#### 📄 styles.css
```css
/* Shared styles for popup and config pages */

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}

/* Popup Styles */
.popup-container {
  width: 320px;
  padding: 20px;
  background: white;
}

.popup-container h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
  text-align: center;
}

.status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #44BB44;
}

.dictate-btn {
  width: 100%;
  padding: 12px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.dictate-btn:hover:not(:disabled) {
  background: #45a049;
}

.dictate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.shortcut {
  font-size: 12px;
  opacity: 0.8;
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 4px;
}

.settings-link {
  text-align: center;
  margin: 20px 0;
}

.settings-link a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.settings-link a:hover {
  color: #333;
}

.tips {
  border-top: 1px solid #eee;
  padding-top: 15px;
  font-size: 13px;
  color: #666;
}

.tips p {
  margin: 0 0 8px 0;
  font-weight: 500;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  margin-bottom: 4px;
}

/* Config Page Styles */
.config-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  background: white;
  min-height: 100vh;
}

.config-container h1 {
  margin: 0 0 40px 0;
  font-size: 28px;
  color: #333;
  text-align: center;
}

.config-section {
  margin-bottom: 40px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
}

.config-section h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: white;
}

.form-group select {
  cursor: pointer;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-group small {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 12px;
}

.form-group small a {
  color: #4CAF50;
}

.save-btn {
  padding: 10px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #45a049;
}

.save-status {
  display: none;
  margin-top: 15px;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
}

.save-status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.save-status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.config-section ol,
.config-section ul {
  margin: 0;
  padding-left: 25px;
  line-height: 1.8;
}

.config-section li {
  margin-bottom: 8px;
}
```

### Step 3: Create ZIP File

#### Option A: Using Terminal (Mac/Linux)
```bash
cd /path/to/voice-dictation-extension
zip -r voice-dictation-extension.zip .
```

#### Option B: Using Windows
1. Right-click the `voice-dictation-extension` folder
2. Select "Send to" → "Compressed (zipped) folder"

#### Option C: Using macOS Finder
1. Right-click the `voice-dictation-extension` folder
2. Select "Compress 'voice-dictation-extension'"

## Option 2: Quick Copy Script

Save this as `create-extension.sh` and run it:

```bash
#!/bin/bash

# Create directory
mkdir -p voice-dictation-extension

# Create all files
cat > voice-dictation-extension/manifest.json << 'EOF'
{
  "manifest_version": 3,
  "name": "AI Voice Dictation",
  "version": "1.0",
  ...
}
EOF

# Continue for all files...

# Create ZIP
zip -r voice-dictation-extension.zip voice-dictation-extension/

echo "Extension created! Send voice-dictation-extension.zip to Dad"
```

## Option 3: GitHub Repository

I can create a GitHub repository with all the files if you prefer. Then you'd just:
1. Click "Download ZIP" from GitHub
2. Send to your dad

## Installation for Dad

1. Extract the ZIP file
2. Open Chrome and go to `chrome://extensions/`
3. Turn on "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the extracted folder
6. Get API key from [console.groq.com](https://console.groq.com)
7. Click extension icon → Settings → Add API key
8. Start using with Ctrl+Shift+1!

The extension will sync across all his Chromebooks automatically.