// Simplified content script - works with any text field the user selects
let recordingIndicator = null;

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

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startDictation') {
    startDictation();
  }
});

function startDictation() {
  debugLog('Starting dictation');
  
  // Get the currently focused element
  const activeElement = document.activeElement;
  debugLog('Active element', {
    tagName: activeElement?.tagName,
    type: activeElement?.type,
    contentEditable: activeElement?.contentEditable,
    isTextInput: isTextInput(activeElement)
  });
  
  // Check if it's a text input field
  if (!isTextInput(activeElement)) {
    showNotification('Please click in a text field first', 'error');
    debugLog('Not a text input field');
    return;
  }
  
  // Store the element reference
  window.voiceDictationTarget = activeElement;
  
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
      // Show debug info to user
      if (response?.debugInfo) {
        console.error('Debug info:', response.debugInfo);
      }
      return;
    }
    
    if (response && response.success) {
      const target = window.voiceDictationTarget;
      if (target && document.body.contains(target)) {
        insertText(target, response.text);
        showNotification('Dictation complete!', 'success');
        debugLog('Text inserted successfully');
      } else {
        showNotification('Text field no longer available', 'error');
        debugLog('Target element lost');
      }
    } else if (response) {
      const errorMsg = response.error || 'Unknown error';
      showNotification('Error: ' + errorMsg, 'error');
      debugLog('Error from background', errorMsg);
      
      // Log debug info if available
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
  if (!element) return;
  
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