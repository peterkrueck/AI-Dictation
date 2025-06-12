// Content script - clipboard-only approach for simplicity and reliability
let recordingIndicator = null;
let currentLanguage = 'en';
let isStoppingRecording = false; // Prevent double-calling stopRecording
let isRecordingActive = false; // Prevent double-press recordings
let lastRecordingStart = 0; // Debounce rapid key presses
const RECORDING_DEBOUNCE_MS = 1000; // Prevent double-press within 1 second

// Debug mode
const DEBUG = false;

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
    recordingAlreadyActive: "Recording already in progress! Please wait for current recording to finish.",
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
    recordingAlreadyActive: "Aufnahme bereits aktiv! Bitte warten Sie, bis die aktuelle Aufnahme beendet ist.",
    noTextFieldError: "Bitte erst in ein Textfeld klicken oder \"Überall-Modus\" im Erweiterungs-Popup aktivieren, um überall zu diktieren.",
    forceModeInfo: "Überall-Modus: Text wird in Zwischenablage kopiert",
    textCopiedSuccess: "✅ Text in Zwischenablage kopiert! Strg+V zum Einfügen drücken.",
    forceModeClipboardSuccess: "✅ Text in Zwischenablage kopiert! Bitte über Strg+V einfügen",
    clipboardError: "Konnte nicht in Zwischenablage kopieren. Text: {text}",
    directInsertError: "Konnte nicht direkt einfügen. Text in Zwischenablage kopiert - Strg+V zum Einfügen drücken.",
    insertError: "Konnte Text nicht einfügen",
    extensionError: "Erweiterungsfehler: {error}",
    error: "Fehler: {error}"
  },
  es: {
    recordingIndicator: "🎤 Grabando... Presiona ENTER o ESC para detener",
    recordingTimeRemaining: "Quedan {seconds}s",
    recordingAlreadyActive: "¡Grabación ya en progreso! Por favor espera a que termine la grabación actual.",
    noTextFieldError: "Por favor haz clic en un campo de texto primero, o habilita \"Modo Fuerza\" en la ventana emergente de la extensión para dictar en cualquier lugar.",
    forceModeInfo: "Modo Fuerza: El texto se copiará al portapapeles",
    textCopiedSuccess: "✅ Texto copiado al portapapeles! Presiona Ctrl+V para pegar.",
    forceModeClipboardSuccess: "✅ Salida copiada al portapapeles! Por favor inserta con Ctrl+V",
    clipboardError: "No se pudo copiar al portapapeles. Texto: {text}",
    directInsertError: "No se pudo insertar directamente. Texto copiado al portapapeles - presiona Ctrl+V para pegar.",
    insertError: "No se pudo insertar el texto",
    extensionError: "Error de extensión: {error}",
    error: "Error: {error}"
  },
  fr: {
    recordingIndicator: "🎤 Enregistrement... Appuyez sur ENTRÉE ou ÉCHAP pour arrêter",
    recordingTimeRemaining: "{seconds}s restantes",
    recordingAlreadyActive: "Enregistrement déjà en cours ! Veuillez attendre que l'enregistrement actuel soit terminé.",
    noTextFieldError: "Veuillez d'abord cliquer dans un champ de texte, ou activez \"Mode Force\" dans la popup de l'extension pour dicter n'importe où.",
    forceModeInfo: "Mode Force: Le texte sera copié dans le presse-papiers",
    textCopiedSuccess: "✅ Texte copié dans le presse-papiers ! Appuyez sur Ctrl+V pour coller.",
    forceModeClipboardSuccess: "✅ Sortie copiée dans le presse-papiers ! Veuillez insérer via Ctrl+V",
    clipboardError: "Impossible de copier dans le presse-papiers. Texte : {text}",
    directInsertError: "Impossible d'insérer directement. Texte copié dans le presse-papiers - appuyez sur Ctrl+V pour coller.",
    insertError: "Impossible d'insérer le texte",
    extensionError: "Erreur d'extension : {error}",
    error: "Erreur : {error}"
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

// Load language preference
chrome.storage.sync.get(['language'], (result) => {
  currentLanguage = result.language || 'en';
  debugLog('Language loaded:', currentLanguage);
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.language) {
      currentLanguage = changes.language.newValue;
      debugLog('Language updated:', currentLanguage);
    }
  }
});

// No longer tracking text elements - always use clipboard

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

// Function removed - no longer searching for text fields

// Make functions globally accessible for ChromeOS
window.voiceDictationExtension = window.voiceDictationExtension || {};

window.voiceDictationExtension.startDictation = function startDictation() {
  debugLog('Starting dictation (clipboard mode)');
  
  const now = Date.now();
  
  // Check if recording is already active
  if (isRecordingActive) {
    debugLog('Recording already active, showing warning');
    showNotification(t('recordingAlreadyActive'), 'warning');
    return;
  }
  
  // Debounce rapid key presses
  if (now - lastRecordingStart < RECORDING_DEBOUNCE_MS) {
    debugLog('Ignoring rapid double-press within debounce period');
    return;
  }
  
  // Set recording as active and update timestamp
  isRecordingActive = true;
  lastRecordingStart = now;
  
  // Reset stopping flag
  isStoppingRecording = false;
  
  // Show info notification
  showNotification(t('clipboardModeInfo'), 'info');
  
  // Show recording indicator
  window.voiceDictationExtension.showRecordingIndicator();
  
  debugLog('Sending startRecording message to background');
  
  // Request recording from background script
  chrome.runtime.sendMessage({action: 'startRecording'}, (response) => {
    window.voiceDictationExtension.hideRecordingIndicator();
    
    // Reset recording active flag when recording completes (success or error)
    isRecordingActive = false;
    
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
      // Always copy to clipboard
      copyToClipboard(response.text);
    } else if (response) {
      const errorMsg = response.error || 'Unknown error';
      showNotification(t('error', { error: errorMsg }), 'error');
      debugLog('Error from background', errorMsg);
      
      if (response.debugInfo) {
        console.error('Debug information:', response.debugInfo);
      }
    }
  });
}

// Function removed - no longer detecting text input elements

function copyToClipboard(text) {
  debugLog('Copying text to clipboard');
  navigator.clipboard.writeText(text).then(() => {
    showNotification(t('textCopiedSuccess'), 'success');
    debugLog('Text copied to clipboard successfully');
  }).catch((err) => {
    debugLog('Clipboard write failed:', err);
    showNotification(t('clipboardError', { text }), 'error');
  });
}

// Functions removed - no longer inserting text directly into fields

// Functions removed - no longer needed for clipboard-only approach

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
    info: '#2196F3',
    warning: '#FF8C00'
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