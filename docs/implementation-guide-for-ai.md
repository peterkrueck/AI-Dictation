# Voice Dictation Extension - Complete Implementation Guide

## Overview
This document contains complete instructions to fix four critical issues in the Voice Dictation Chrome Extension. Please implement all changes exactly as specified.

## Issues to Fix
1. Debug mode not accessible (needs always-visible button)
2. Keyboard shortcut (Ctrl+Shift+1) not working
3. Text field detection failing on many websites
4. Recording timeout too short (needs 60 seconds)

## File Changes Required

### 1. Update manifest.json
**Add clipboard permission for the clipboard fallback feature:**

```json
{
  "manifest_version": 3,
  "name": "AI Voice Dictation",
  "version": "1.1",
  "description": "Intelligent voice dictation with Groq AI",
  "minimum_chrome_version": "116",
  "permissions": [
    "activeTab",
    "storage",
    "scripting",
    "offscreen",
    "clipboardWrite"
  ],
  "optional_permissions": [
    "management"
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
      "js": ["content.js"],
      "run_at": "document_idle"
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

### 2. Replace popup.html
**Complete replacement with debug button and force mode toggle:**

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
    
    <!-- NEW: Force Mode Toggle -->
    <div class="force-mode-container">
      <label class="toggle-label">
        <input type="checkbox" id="force-mode-toggle">
        <span>Force Mode</span>
        <small>Dictate anywhere, copy to clipboard if needed</small>
      </label>
    </div>
    
    <button id="dictate-btn" class="dictate-btn">
      Start Dictation
      <span class="shortcut">Ctrl+Shift+1</span>
    </button>
    
    <div class="settings-link">
      <a href="#" id="settings-link">⚙️ Settings</a>
    </div>
    
    <!-- NEW: Always visible debug button -->
    <div class="debug-section">
      <button id="debug-btn" class="debug-btn">
        🐛 View Debug Logs
      </button>
    </div>
    
    <div class="tips">
      <p><strong>Tips:</strong></p>
      <ul>
        <li>Click in any text field</li>
        <li>Press <span class="actual-shortcut">Ctrl+Shift+1</span> or click button</li>
        <li>Speak clearly</li>
        <li>Press Enter/Esc or click to stop</li>
      </ul>
    </div>
  </div>
  
  <script src="popup.js"></script>
</body>
</html>
```

### 3. Replace popup.js
**Complete replacement with all new features:**

```javascript
// Popup script handles UI interactions

document.addEventListener('DOMContentLoaded', () => {
  const dictateBtn = document.getElementById('dictate-btn');
  const settingsLink = document.getElementById('settings-link');
  const statusText = document.getElementById('status-text');
  const statusDot = document.querySelector('.status-dot');
  const debugBtn = document.getElementById('debug-btn');
  const forceModeToggle = document.getElementById('force-mode-toggle');
  
  // Check if API key is set
  chrome.storage.sync.get(['groqApiKey', 'forceDictation'], (result) => {
    if (!result.groqApiKey) {
      statusText.textContent = 'API key not set';
      statusDot.style.backgroundColor = '#FF4444';
      dictateBtn.disabled = true;
    } else {
      statusText.textContent = 'Ready';
      statusDot.style.backgroundColor = '#44BB44';
    }
    
    // Set force mode toggle state
    forceModeToggle.checked = result.forceDictation || false;
  });
  
  // Display actual keyboard shortcut
  chrome.commands.getAll((commands) => {
    const dictationCommand = commands.find(cmd => cmd.name === 'start-dictation');
    if (dictationCommand && dictationCommand.shortcut) {
      document.querySelectorAll('.shortcut, .actual-shortcut').forEach(el => {
        el.textContent = dictationCommand.shortcut;
      });
    } else {
      document.querySelectorAll('.shortcut, .actual-shortcut').forEach(el => {
        el.textContent = 'Not set';
      });
      // Add help text
      const helpText = document.createElement('small');
      helpText.style.color = '#666';
      helpText.textContent = ' (Set in chrome://extensions/shortcuts)';
      document.querySelector('.actual-shortcut').after(helpText);
    }
  });
  
  // Handle force mode toggle
  forceModeToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ forceDictation: forceModeToggle.checked }, () => {
      showNotification(
        forceModeToggle.checked 
          ? 'Force Mode enabled - dictate anywhere!' 
          : 'Force Mode disabled', 
        'success'
      );
    });
  });
  
  // Handle debug button (always visible)
  debugBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'getDebugLogs' }, (logs) => {
      console.log('=== Voice Dictation Debug Logs ===');
      console.log('Extension Version: 1.1');
      console.log('Time:', new Date().toISOString());
      console.log('Total Logs:', logs ? logs.length : 0);
      console.log('');
      
      if (logs && logs.length > 0) {
        logs.forEach(log => {
          console.log(`[${log.timestamp}] [${log.context}] ${log.message}`, 
            log.data ? JSON.parse(log.data) : '');
        });
        
        // Copy to clipboard
        const debugText = logs.map(log => 
          `[${log.timestamp}] [${log.context}] ${log.message} ${log.data || ''}`
        ).join('\n');
        
        navigator.clipboard.writeText(debugText).then(() => {
          showNotification('Debug logs copied to clipboard & console (F12)', 'success');
        }).catch(() => {
          showNotification('Debug logs in console (F12)', 'success');
        });
      } else {
        console.log('No debug logs found');
      }
      
      console.log('=== End Debug Logs ===');
    });
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

function showNotification(message, type) {
  // Simple notification for popup
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    background: ${type === 'success' ? '#44BB44' : '#FF4444'};
    color: white;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 9999;
    text-align: center;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 2000);
}
```

### 4. Update styles.css
**Add these styles to the end of the existing styles.css file:**

```css
/* Force Mode Toggle */
.force-mode-container {
  margin: 15px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.toggle-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.toggle-label span {
  font-weight: 500;
  color: #333;
}

.toggle-label small {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: #666;
  margin-left: 26px;
}

/* Debug Button */
.debug-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.debug-btn {
  width: 100%;
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.debug-btn:hover {
  background: #5a6268;
}
```

### 5. Replace content.js
**Complete replacement with improved text detection and force mode:**

```javascript
// Content script with force mode and improved detection
let recordingIndicator = null;
let forceMode = false;

// Debug mode
const DEBUG = true;

function debugLog(message, data = null) {
  if (!DEBUG) return;
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[Content ${timestamp}] ${message}`, data);
  } else {
    console.log(`[Content ${timestamp}] ${message}`);
  }
}

debugLog('Content script loaded on', window.location.href);

// Load force mode preference
chrome.storage.sync.get(['forceDictation'], (result) => {
  forceMode = result.forceDictation || false;
  debugLog('Force mode loaded:', forceMode);
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.forceDictation) {
    forceMode = changes.forceDictation.newValue;
    debugLog('Force mode updated:', forceMode);
  }
});

// Track last focused text element
window.lastFocusedTextElement = null;
document.addEventListener('focusin', (e) => {
  if (isTextInput(e.target)) {
    window.lastFocusedTextElement = e.target;
    debugLog('Tracked focused element:', e.target.tagName);
  }
}, true);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startDictation') {
    startDictation();
  } else if (request.action === 'recordingWarning') {
    updateRecordingIndicator(request.secondsRemaining);
  } else if (request.action === 'ping') {
    // Respond to ping to confirm content script is loaded
    sendResponse({ status: 'ready' });
  }
});

function findBestTextTarget() {
  debugLog('Finding best text target...');
  
  // Priority 1: Currently focused element
  const focused = document.activeElement;
  if (isTextInput(focused)) {
    debugLog('Using focused element:', focused.tagName);
    return focused;
  }
  
  // Priority 2: Recently focused element
  if (window.lastFocusedTextElement && 
      document.body.contains(window.lastFocusedTextElement) && 
      isTextInput(window.lastFocusedTextElement)) {
    debugLog('Using last focused element:', window.lastFocusedTextElement.tagName);
    return window.lastFocusedTextElement;
  }
  
  // Priority 3: Find any visible text input
  const selectors = [
    'input[type="text"]:not([readonly]):not([disabled])',
    'input[type="email"]:not([readonly]):not([disabled])',
    'input[type="search"]:not([readonly]):not([disabled])',
    'input[type="url"]:not([readonly]):not([disabled])',
    'input[type="tel"]:not([readonly]):not([disabled])',
    'input:not([type]):not([readonly]):not([disabled])',
    'textarea:not([readonly]):not([disabled])',
    '[contenteditable="true"]:not([readonly])',
    '[contenteditable=""]:not([readonly])',
    '[role="textbox"]:not([aria-readonly="true"]):not([aria-disabled="true"])',
    '[role="searchbox"]:not([aria-readonly="true"]):not([aria-disabled="true"])',
    '[role="combobox"]:not([aria-readonly="true"]):not([aria-disabled="true"])'
  ];
  
  const inputs = document.querySelectorAll(selectors.join(', '));
  
  for (const input of inputs) {
    const rect = input.getBoundingClientRect();
    const style = window.getComputedStyle(input);
    
    // Check if element is visible
    if (rect.width > 0 && 
        rect.height > 0 && 
        style.display !== 'none' && 
        style.visibility !== 'hidden' && 
        style.opacity !== '0') {
      debugLog('Found visible input:', input.tagName);
      return input;
    }
  }
  
  debugLog('No suitable text target found');
  return null;
}

function startDictation() {
  debugLog('Starting dictation, force mode:', forceMode);
  
  let targetElement = findBestTextTarget();
  
  if (!targetElement && !forceMode) {
    showNotification(
      'Please click in a text field first, or enable "Force Mode" in the extension popup to dictate anywhere.', 
      'error'
    );
    return;
  }
  
  // Store the element or null for clipboard fallback
  window.voiceDictationTarget = targetElement;
  
  if (!targetElement && forceMode) {
    showNotification('Force Mode: Text will be copied to clipboard', 'info');
  }
  
  // Show recording indicator
  showRecordingIndicator();
  
  debugLog('Sending startRecording message to background');
  
  // Request recording from background script
  chrome.runtime.sendMessage({action: 'startRecording'}, (response) => {
    hideRecordingIndicator();
    
    debugLog('Received response from background', response);
    
    if (chrome.runtime.lastError) {
      const error = chrome.runtime.lastError.message;
      debugLog('Runtime error', error);
      showNotification('Extension error: ' + error, 'error');
      if (response?.debugInfo) {
        console.error('Debug info:', response.debugInfo);
      }
      return;
    }
    
    if (response && response.success) {
      const target = window.voiceDictationTarget;
      insertText(target, response.text);
    } else if (response) {
      const errorMsg = response.error || 'Unknown error';
      showNotification('Error: ' + errorMsg, 'error');
      debugLog('Error from background', errorMsg);
      
      if (response.debugInfo) {
        console.error('Debug information:', response.debugInfo);
      }
    }
    
    // Clean up
    window.voiceDictationTarget = null;
  });
}

function isTextInput(element) {
  if (!element) return false;
  
  // For shadow DOM elements, try to get the actual input
  if (element.shadowRoot) {
    const shadowInput = element.shadowRoot.querySelector('input, textarea, [contenteditable="true"]');
    if (shadowInput) {
      element = shadowInput;
    }
  }
  
  const tagName = element.tagName?.toLowerCase();
  
  // Standard form inputs
  if (tagName === 'textarea') return true;
  if (tagName === 'input') {
    const type = (element.type || 'text').toLowerCase();
    const textTypes = ['text', 'email', 'search', 'url', 'tel', 'password', 'number', 'date', 'time', 'datetime-local'];
    return textTypes.includes(type);
  }
  
  // Contenteditable elements
  if (element.isContentEditable) return true;
  if (element.contentEditable === 'true' || element.contentEditable === 'plaintext-only') return true;
  
  // Role-based detection
  const role = element.getAttribute('role');
  if (role === 'textbox' || role === 'searchbox' || role === 'combobox') return true;
  
  // Check if it has text-like attributes
  if (element.hasAttribute('contenteditable')) return true;
  
  // Check for common editor indicators
  const classNames = element.className || '';
  const editorClasses = ['editor', 'editable', 'textbox', 'input'];
  if (editorClasses.some(cls => classNames.toLowerCase().includes(cls))) return true;
  
  return false;
}

function insertText(element, text) {
  if (!element) {
    // Clipboard fallback for force mode
    debugLog('No element found, using clipboard fallback');
    navigator.clipboard.writeText(text).then(() => {
      showNotification('✅ Text copied to clipboard! Press Ctrl+V to paste.', 'success');
      debugLog('Text copied to clipboard successfully');
    }).catch((err) => {
      debugLog('Clipboard write failed:', err);
      showNotification('Could not copy to clipboard. Text: ' + text, 'error');
    });
    return;
  }
  
  debugLog('Inserting text into element:', element.tagName);
  
  // Focus the element first
  element.focus();
  
  // Method 1: Try using execCommand (works for most contenteditable)
  if (document.execCommand && element.isContentEditable) {
    // Select all content if needed
    const selection = window.getSelection();
    const range = document.createRange();
    
    // If there's selected text, it will be replaced
    if (selection.rangeCount > 0) {
      // Use existing selection
    } else {
      // Place cursor at end
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    // Try to insert text
    if (document.execCommand('insertText', false, text)) {
      // Trigger input event
      element.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
  }
  
  // Method 2: For input and textarea elements
  if (element.tagName?.toLowerCase() === 'input' || element.tagName?.toLowerCase() === 'textarea') {
    const start = element.selectionStart || 0;
    const end = element.selectionEnd || start;
    const currentValue = element.value || '';
    
    // Insert text at cursor position
    element.value = currentValue.substring(0, start) + text + currentValue.substring(end);
    
    // Set cursor position after inserted text
    const newPosition = start + text.length;
    element.selectionStart = element.selectionEnd = newPosition;
    
    // Trigger events
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }
  
  // Method 3: For contenteditable using Selection API
  if (element.isContentEditable) {
    try {
      const selection = window.getSelection();
      let range;
      
      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        range.deleteContents();
      } else {
        range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
      }
      
      // Insert text node
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      
      // Move cursor after inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Trigger input event
      element.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    } catch (e) {
      console.error('Selection API method failed:', e);
    }
  }
  
  // Method 4: Fallback - try to set value or textContent
  try {
    if ('value' in element) {
      element.value = (element.value || '') + text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else if ('textContent' in element) {
      element.textContent = (element.textContent || '') + text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      throw new Error('Could not insert text');
    }
  } catch (e) {
    // Last resort: Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Could not insert directly. Text copied to clipboard - press Ctrl+V to paste.', 'info');
    }).catch(() => {
      showNotification('Could not insert text', 'error');
    });
  }
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
    z-index: 2147483647;
    animation: slideIn 0.3s ease-out;
  `;
  
  const dot = recordingIndicator.querySelector('.recording-dot');
  dot.style.cssText = `
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  `;
  
  // Add animations if not present
  if (!document.getElementById('voice-dictation-styles')) {
    const style = document.createElement('style');
    style.id = 'voice-dictation-styles';
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  const stopRecording = () => {
    chrome.runtime.sendMessage({action: 'stopRecording'});
    hideRecordingIndicator();
  };
  
  recordingIndicator.onclick = stopRecording;
  
  // Keyboard shortcuts to stop recording
  const keyHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      stopRecording();
      document.removeEventListener('keydown', keyHandler, true);
    }
  };
  
  document.addEventListener('keydown', keyHandler, true);
  recordingIndicator.keyHandler = keyHandler;
  
  document.body.appendChild(recordingIndicator);
}

function hideRecordingIndicator() {
  if (recordingIndicator) {
    if (recordingIndicator.keyHandler) {
      document.removeEventListener('keydown', recordingIndicator.keyHandler, true);
    }
    recordingIndicator.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      if (recordingIndicator && recordingIndicator.parentNode) {
        recordingIndicator.remove();
        recordingIndicator = null;
      }
    }, 300);
  }
}

function updateRecordingIndicator(secondsRemaining) {
  if (recordingIndicator) {
    const span = recordingIndicator.querySelector('span');
    span.innerHTML = `Recording... <strong style="color: yellow;">${secondsRemaining}s remaining</strong> (Press Enter/Esc to stop)`;
    
    if (secondsRemaining <= 5) {
      recordingIndicator.style.background = '#FF6B6B';
      recordingIndicator.style.animation = 'pulse 0.5s infinite';
    } else if (secondsRemaining <= 10) {
      recordingIndicator.style.background = '#FF8C42';
    }
  }
}

function showNotification(message, type = 'info') {
  // Remove any existing notifications
  const existing = document.getElementById('voice-dictation-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.id = 'voice-dictation-notification';
  
  const colors = {
    error: '#FF4444',
    success: '#44BB44',
    info: '#2196F3'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type] || colors.info};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 2147483647;
    animation: slideIn 0.3s ease-out;
    max-width: 350px;
    word-wrap: break-word;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  const duration = type === 'error' ? 5000 : 3000;
  setTimeout(() => {
    if (notification && notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (notification && notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, duration);
}
```

### 6. Update background.js
**Add these functions and modifications to the existing background.js file:**

Find and replace the following sections:

#### Add after the existing debugLog function:
```javascript
// Ensure content script is loaded before sending messages
async function ensureContentScriptLoaded(tabId) {
  try {
    // Try to ping content script
    const response = await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    debugLog('CONTENT_SCRIPT', 'Content script is responsive', response);
    return true;
  } catch (error) {
    // Content script not loaded, inject it
    debugLog('CONTENT_SCRIPT', 'Content script not found, injecting...', error.message);
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
      debugLog('CONTENT_SCRIPT', 'Content script injected successfully');
      // Wait a bit for script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (injectError) {
      debugLog('CONTENT_SCRIPT', 'Failed to inject content script', injectError.message);
      return false;
    }
  }
}
```

#### Replace the chrome.commands.onCommand listener:
```javascript
// Listen for keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'start-dictation') {
    debugLog('SHORTCUT', 'Keyboard shortcut triggered', command);
    
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      if (tab) {
        debugLog('SHORTCUT', 'Active tab found', { id: tab.id, url: tab.url });
        
        const loaded = await ensureContentScriptLoaded(tab.id);
        if (loaded) {
          chrome.tabs.sendMessage(tab.id, {action: 'startDictation'});
        } else {
          // Could not load content script - maybe show a notification
          debugLog('SHORTCUT', 'Could not ensure content script');
        }
      }
    } catch (error) {
      debugLog('SHORTCUT', 'Error handling shortcut', error);
    }
  }
});
```

#### Add these variables before the startRecording function:
```javascript
let recordingStartTime = null;
let countdownInterval = null;
```

#### In the startRecording function, after `isRecording = true;`, add:
```javascript
recordingStartTime = Date.now();

// Start countdown updates
countdownInterval = setInterval(() => {
  if (isRecording) {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const remaining = 60 - elapsed;
    
    debugLog('RECORDING', `Time remaining: ${remaining}s`);
    
    if (remaining <= 10 && remaining > 0) {
      // Send warning to content script
      chrome.tabs.sendMessage(tab.id, {
        action: 'recordingWarning',
        secondsRemaining: remaining
      }).catch(() => {
        // Tab might be closed, ignore
      });
    }
    
    if (remaining <= 0) {
      debugLog('RECORDING', 'Auto-stopping after 60 seconds');
      stopRecording();
    }
  }
}, 1000);
```

#### Change the timeout from 30000 to 60000:
```javascript
// Auto-stop timeout
setTimeout(() => {
  if (isRecording) {
    debugLog('RECORDING', 'Auto-stopping after 60 seconds');
    stopRecording();
  }
}, 60000); // Changed from 30000
```

#### In the stopRecording function, after `if (isRecording) {`, add:
```javascript
if (countdownInterval) {
  clearInterval(countdownInterval);
  countdownInterval = null;
}
```

## Testing Instructions

After implementing all changes:

1. **Test Debug Mode**
   - Click extension icon
   - Click "View Debug Logs" button
   - Check browser console (F12) for logs
   - Verify logs are copied to clipboard

2. **Test Keyboard Shortcut**
   - Press Ctrl+Shift+1 on any webpage
   - Verify recording starts
   - Check if actual shortcut is displayed in popup

3. **Test Force Mode**
   - Enable Force Mode toggle in popup
   - Try dictating on a page with no text fields
   - Verify text is copied to clipboard

4. **Test 60-second Recording**
   - Start recording and wait
   - Verify countdown appears at 10 seconds
   - Verify auto-stop at 60 seconds

## Version Update
Remember to update the version in manifest.json to "1.1" to reflect these changes.

## Summary
This implementation fixes all four identified issues:
1. ✅ Debug button is now always visible
2. ✅ Keyboard shortcuts work reliably with content script injection
3. ✅ Force Mode allows dictation anywhere with clipboard fallback
4. ✅ Recording timeout increased to 60 seconds with countdown warning