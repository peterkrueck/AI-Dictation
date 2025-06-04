// Content script with force mode and improved detection
let recordingIndicator = null;
let forceMode = false;
let currentLanguage = 'en';
let isStoppingRecording = false; // Prevent double-calling stopRecording

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

// Load translations inline since content scripts can't use dynamic imports
const translations = {
  en: {
    recordingIndicator: "🎤 Recording... Press ENTER or ESC to stop",
    recordingTimeRemaining: "{seconds}s remaining",
    noTextFieldError: "Please click in a text field first, or enable \"Force Mode\" in the extension popup to dictate anywhere.",
    forceModeInfo: "Force Mode: Text will be copied to clipboard",
    textCopiedSuccess: "✅ Text copied to clipboard! Press Ctrl+V to paste.",
    forceModeClipboardSuccess: "✅ Output copied to clipboard! Please insert via Ctrl+V",
    clipboardError: "Could not copy to clipboard. Text: {text}",
    directInsertError: "Could not insert directly. Text copied to clipboard - press Ctrl+V to paste.",
    insertError: "Could not insert text",
    extensionError: "Extension error: {error}",
    error: "Error: {error}"
  },
  de: {
    recordingIndicator: "🎤 Aufnahme... ENTER oder ESC zum Beenden",
    recordingTimeRemaining: "Noch {seconds}s",
    noTextFieldError: "Bitte erst in ein Textfeld klicken oder \"Überall-Modus\" im Erweiterungs-Popup aktivieren, um überall zu diktieren.",
    forceModeInfo: "Überall-Modus: Text wird in Zwischenablage kopiert",
    textCopiedSuccess: "✅ Text in Zwischenablage kopiert! Strg+V zum Einfügen drücken.",
    forceModeClipboardSuccess: "✅ Text in Zwischenablage kopiert! Bitte über Strg+V einfügen",
    clipboardError: "Konnte nicht in Zwischenablage kopieren. Text: {text}",
    directInsertError: "Konnte nicht direkt einfügen. Text in Zwischenablage kopiert - Strg+V zum Einfügen drücken.",
    insertError: "Konnte Text nicht einfügen",
    extensionError: "Erweiterungsfehler: {error}",
    error: "Fehler: {error}"
  }
};

// Helper function to get translation
function t(key, replacements = {}) {
  let text = translations[currentLanguage]?.[key] || translations.en[key] || key;
  
  // Replace placeholders
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
  });
  
  return text;
}

// Load force mode and language preferences
chrome.storage.sync.get(['forceDictation', 'language'], (result) => {
  forceMode = result.forceDictation || false;
  currentLanguage = result.language || 'en';
  debugLog('Force mode loaded:', forceMode);
  debugLog('Language loaded:', currentLanguage);
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.forceDictation) {
      forceMode = changes.forceDictation.newValue;
      debugLog('Force mode updated:', forceMode);
    }
    if (changes.language) {
      currentLanguage = changes.language.newValue;
      debugLog('Language updated:', currentLanguage);
    }
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
    window.voiceDictationExtension.startDictation();
  } else if (request.action === 'recordingWarning') {
    updateRecordingIndicator(request.secondsRemaining);
  } else if (request.action === 'ping') {
    // Respond to ping to confirm content script is loaded
    sendResponse({ status: 'ready' });
  }
});

// ChromeOS global keyboard handler
if (navigator.userAgent.includes('CrOS')) {
  debugLog('ChromeOS detected, adding global keyboard handler');
  
  document.addEventListener('keydown', (event) => {
    // Check for Ctrl+Shift+1
    if (event.ctrlKey && event.shiftKey && event.key === '1') {
      debugLog('ChromeOS keyboard shortcut detected');
      event.preventDefault();
      event.stopPropagation();
      
      // Start dictation directly
      window.voiceDictationExtension.startDictation();
    }
  }, true); // Use capture phase
}

function findBestTextTarget() {
  debugLog('Finding best text target...');
  
  // Special case for Google Docs
  if (window.location.hostname === 'docs.google.com') {
    debugLog('Google Docs detected, returning special marker');
    return 'google-docs-special-case';
  }
  
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

// Make functions globally accessible for ChromeOS
window.voiceDictationExtension = window.voiceDictationExtension || {};

window.voiceDictationExtension.startDictation = function startDictation() {
  debugLog('Starting dictation, force mode:', forceMode);
  
  // Reset stopping flag
  isStoppingRecording = false;
  
  let targetElement = findBestTextTarget();
  
  // Handle Google Docs special case
  if (targetElement === 'google-docs-special-case') {
    // For Google Docs, we'll proceed with the recording
    window.voiceDictationTarget = 'google-docs-special-case';
  } else if (!targetElement && !forceMode) {
    showNotification(t('noTextFieldError'), 'error');
    return;
  } else {
    // Store the element or null for clipboard fallback
    window.voiceDictationTarget = targetElement;
  }
  
  if (!targetElement && forceMode) {
    showNotification(t('forceModeInfo'), 'info');
  }
  
  // Show recording indicator
  window.voiceDictationExtension.showRecordingIndicator();
  
  debugLog('Sending startRecording message to background');
  
  // Request recording from background script
  chrome.runtime.sendMessage({action: 'startRecording'}, (response) => {
    window.voiceDictationExtension.hideRecordingIndicator();
    
    debugLog('Received response from background', response);
    
    if (chrome.runtime.lastError) {
      const error = chrome.runtime.lastError.message;
      debugLog('Runtime error', error);
      showNotification(t('extensionError', { error }), 'error');
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
      showNotification(t('error', { error: errorMsg }), 'error');
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
  // If Force Mode is enabled, ALWAYS copy to clipboard instead of inserting
  if (forceMode) {
    debugLog('Force Mode enabled, copying to clipboard instead of inserting');
    navigator.clipboard.writeText(text).then(() => {
      showNotification(t('forceModeClipboardSuccess'), 'success');
      debugLog('Text copied to clipboard successfully (Force Mode)');
    }).catch((err) => {
      debugLog('Clipboard write failed in Force Mode:', err);
      showNotification(t('clipboardError', { text }), 'error');
    });
    return;
  }
  
  // Special handling for Google Docs
  if (element === 'google-docs-special-case') {
    insertTextGoogleDocs(text);
    return;
  }
  
  // Special handling for Telekom Email
  if (window.location.hostname.includes('email.t-online.de')) {
    const iframe = document.querySelector('iframe[id*="mail"]');
    if (iframe) {
      insertTextTelekomEmail(iframe, text);
      return;
    }
  }
  
  if (!element) {
    // Clipboard fallback for when no element is found
    debugLog('No element found, using clipboard fallback');
    navigator.clipboard.writeText(text).then(() => {
      showNotification(t('textCopiedSuccess'), 'success');
      debugLog('Text copied to clipboard successfully');
    }).catch((err) => {
      debugLog('Clipboard write failed:', err);
      showNotification(t('clipboardError', { text }), 'error');
    });
    return;
  }
  
  // Standard insertion method
  insertTextStandard(element, text);
}

// Helper function for standard text insertion
function insertTextStandard(element, text) {
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
      showNotification(t('directInsertError'), 'info');
    }).catch(() => {
      showNotification(t('insertError'), 'error');
    });
  }
}

// Helper function for Google Docs
function insertTextGoogleDocs(text) {
  debugLog('Using Google Docs specific insertion method');
  
  // Find the Google Docs editor iframe
  const iframe = document.querySelector('iframe.docs-texteventtarget-iframe');
  if (!iframe || !iframe.contentDocument) {
    debugLog('Google Docs iframe not found, using clipboard fallback');
    navigator.clipboard.writeText(text).then(() => {
      showNotification(t('textCopiedSuccess'), 'success');
    }).catch(() => {
      showNotification(t('clipboardError', { text }), 'error');
    });
    return;
  }
  
  try {
    // Focus the iframe
    iframe.contentWindow.focus();
    
    // Use clipboard API to paste into Google Docs
    navigator.clipboard.writeText(text).then(() => {
      // Simulate paste event
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer(),
        bubbles: true,
        cancelable: true
      });
      
      // Add text to clipboard data
      pasteEvent.clipboardData.setData('text/plain', text);
      
      // Dispatch to iframe's document
      iframe.contentDocument.dispatchEvent(pasteEvent);
      
      // If that doesn't work, try keyboard simulation
      setTimeout(() => {
        const keyEvent = new KeyboardEvent('keydown', {
          key: 'v',
          ctrlKey: true,
          bubbles: true
        });
        iframe.contentDocument.dispatchEvent(keyEvent);
      }, 100);
      
      debugLog('Text inserted into Google Docs');
    }).catch((err) => {
      debugLog('Failed to insert into Google Docs:', err);
      showNotification(t('directInsertError'), 'info');
    });
  } catch (e) {
    debugLog('Error with Google Docs insertion:', e);
    navigator.clipboard.writeText(text).then(() => {
      showNotification(t('textCopiedSuccess'), 'success');
    }).catch(() => {
      showNotification(t('clipboardError', { text }), 'error');
    });
  }
}

// Helper function for Telekom Email
function insertTextTelekomEmail(iframe, text) {
  debugLog('Using Telekom Email specific insertion method');
  
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const editor = iframeDoc.querySelector('body[contenteditable="true"], div[contenteditable="true"]');
    
    if (editor) {
      editor.focus();
      
      // Try execCommand first
      if (iframeDoc.execCommand('insertText', false, text)) {
        debugLog('Text inserted via execCommand in Telekom Email');
        return;
      }
      
      // Fallback to direct insertion
      const selection = iframe.contentWindow.getSelection();
      const range = iframeDoc.createRange();
      
      if (selection.rangeCount > 0) {
        range.deleteContents();
      }
      
      const textNode = iframeDoc.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      debugLog('Text inserted via Selection API in Telekom Email');
    } else {
      throw new Error('Editor not found in iframe');
    }
  } catch (e) {
    debugLog('Failed to insert into Telekom Email:', e);
    navigator.clipboard.writeText(text).then(() => {
      showNotification(t('textCopiedSuccess'), 'success');
    }).catch(() => {
      showNotification(t('clipboardError', { text }), 'error');
    });
  }
}

// Helper function to check element visibility
function isElementVisible(element) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  
  return rect.width > 0 && 
         rect.height > 0 && 
         style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0';
}

window.voiceDictationExtension.showRecordingIndicator = function showRecordingIndicator() {
  // Check if already showing to prevent duplicates
  if (recordingIndicator) {
    debugLog('Recording indicator already showing');
    return;
  }
  
  recordingIndicator = document.createElement('div');
  recordingIndicator.id = 'voice-dictation-indicator';
  recordingIndicator.innerHTML = `
    <div class="recording-dot"></div>
    <span>${t('recordingIndicator')}</span>
  `;
  recordingIndicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #FF4444;
    color: white;
    padding: 14px 24px;
    border-radius: 30px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    cursor: pointer;
    z-index: 2147483647;
    animation: slideIn 0.3s ease-out;
    user-select: none;
    transition: transform 0.1s ease, opacity 0.1s ease;
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
    if (isStoppingRecording) {
      debugLog('Already stopping recording, ignoring duplicate call');
      return;
    }
    isStoppingRecording = true;
    debugLog('Stop recording triggered');
    chrome.runtime.sendMessage({action: 'stopRecording'});
    window.voiceDictationExtension.hideRecordingIndicator();
  };
  
  recordingIndicator.onclick = stopRecording;
  
  // Single robust keyboard handler on the focused indicator
  const keyHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      debugLog(`Key pressed during recording: ${e.key}`);
      e.preventDefault();
      e.stopPropagation();
      
      // Visual feedback that key was detected
      if (recordingIndicator) {
        recordingIndicator.style.transform = 'scale(0.95)';
        recordingIndicator.style.opacity = '0.8';
        setTimeout(() => {
          if (recordingIndicator) {
            recordingIndicator.style.transform = 'scale(1)';
            recordingIndicator.style.opacity = '1';
          }
        }, 100);
      }
      
      stopRecording();
    }
  };
  
  document.body.appendChild(recordingIndicator);
  
  // Make the indicator focusable and focus it
  recordingIndicator.setAttribute('tabindex', '-1');
  recordingIndicator.focus();
  
  // Attach keyboard handler directly to the focused indicator
  recordingIndicator.addEventListener('keydown', keyHandler, true);
  
  // Store handler for cleanup
  recordingIndicator.keyHandler = keyHandler;
  
  // For ChromeOS, also add a global capture handler as backup
  if (navigator.userAgent.includes('CrOS')) {
    debugLog('ChromeOS detected, adding backup global handler');
    const globalHandler = (e) => {
      if (recordingIndicator && (e.key === 'Escape' || e.key === 'Enter')) {
        keyHandler(e);
      }
    };
    window.addEventListener('keydown', globalHandler, true);
    recordingIndicator.globalHandler = globalHandler;
  }
}

window.voiceDictationExtension.hideRecordingIndicator = function hideRecordingIndicator() {
  if (recordingIndicator) {
    // Remove keyboard handler from indicator
    if (recordingIndicator.keyHandler) {
      recordingIndicator.removeEventListener('keydown', recordingIndicator.keyHandler, true);
      delete recordingIndicator.keyHandler;
    }
    
    // Remove ChromeOS global handler if present
    if (recordingIndicator.globalHandler) {
      window.removeEventListener('keydown', recordingIndicator.globalHandler, true);
      delete recordingIndicator.globalHandler;
    }
    
    // Animate out
    recordingIndicator.style.animation = 'slideOut 0.3s ease-out';
    
    // Remove after animation
    setTimeout(() => {
      if (recordingIndicator && recordingIndicator.parentNode) {
        recordingIndicator.remove();
        recordingIndicator = null;
      }
      // Reset stopping flag
      isStoppingRecording = false;
    }, 300);
  }
}

function updateRecordingIndicator(secondsRemaining) {
  if (recordingIndicator) {
    const span = recordingIndicator.querySelector('span');
    const baseText = t('recordingIndicator');
    const timeText = t('recordingTimeRemaining', { seconds: secondsRemaining });
    span.innerHTML = `${baseText.replace('...', '')}... <strong style="color: yellow;">${timeText}</strong>`;
    
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
    success: '#00C851',
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