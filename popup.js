// Popup script handles UI interactions

// Import translations
import { t, getCurrentLanguage, translations } from './translations.js';

// Add error handler
window.addEventListener('error', (e) => {
  console.error('Popup script error:', e);
  console.error('Error details:', e.message, e.filename, e.lineno, e.colno);
});

// Add unhandled rejection handler for promise errors
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

console.log('Popup script loaded');
console.log('Translations module loaded:', typeof translations);

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing popup...');
  try {
    // Get all elements first
    const elements = {
      dictateBtn: document.getElementById('dictate-btn'),
      settingsLink: document.getElementById('settings-link'),
      statusText: document.getElementById('status-text'),
      statusDot: document.querySelector('.status-dot')
    };
    
    // Check if all elements exist
    const missingElements = Object.entries(elements)
      .filter(([name, el]) => !el)
      .map(([name]) => name);
    
    if (missingElements.length > 0) {
      console.error('Missing elements:', missingElements);
      // Continue with available elements instead of returning
    }
    
    // Initialize UI with default language first
    await initializeUI(elements);
    
    // Update UI with translations (with timeout to prevent hanging)
    const translationTimeout = new Promise((resolve) => {
      setTimeout(() => {
        console.warn('Translation update timed out, using defaults');
        resolve();
      }, 2000);
    });
    
    await Promise.race([updateUITranslations(elements), translationTimeout]);
    
    // Check if API key is set
    chrome.storage.sync.get(['groqApiKey'], async (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting storage:', chrome.runtime.lastError);
        return;
      }
      
      if (!result.groqApiKey) {
        if (elements.statusText) elements.statusText.textContent = await t('statusApiKeyNotSet');
        if (elements.statusDot) elements.statusDot.style.backgroundColor = '#FF4444';
        if (elements.dictateBtn) elements.dictateBtn.disabled = true;
      } else {
        if (elements.statusText) elements.statusText.textContent = await t('statusReady');
        if (elements.statusDot) elements.statusDot.style.backgroundColor = '#44BB44';
      }
    });
    
    // Display actual keyboard shortcut
    chrome.commands.getAll(async (commands) => {
      const dictationCommand = commands.find(cmd => cmd.name === 'start-dictation');
      if (dictationCommand && dictationCommand.shortcut) {
        document.querySelectorAll('.shortcut, .actual-shortcut').forEach(el => {
          el.textContent = dictationCommand.shortcut;
        });
      } else {
        document.querySelectorAll('.shortcut, .actual-shortcut').forEach(async el => {
          el.textContent = await t('shortcutNotSet');
        });
        // Add help text
        const actualShortcut = document.querySelector('.actual-shortcut');
        if (actualShortcut && !actualShortcut.nextElementSibling) {
          const helpText = document.createElement('small');
          helpText.style.color = '#666';
          helpText.textContent = ' ' + await t('shortcutHelpText');
          actualShortcut.after(helpText);
        }
      }
    });
    
    // Handle dictation button click
    if (elements.dictateBtn) {
      elements.dictateBtn.addEventListener('click', () => {
        console.log('Dictate button clicked');
        // Get active tab and start dictation
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if (tabs && tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'startDictation'}, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Error sending message:', chrome.runtime.lastError);
              }
            });
            window.close();
          }
        });
      });
    }
    
    // Handle settings link
    if (elements.settingsLink) {
      elements.settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Settings link clicked');
        chrome.runtime.openOptionsPage();
      });
    }
    
  } catch (error) {
    console.error('Error initializing popup:', error);
  }
});

async function initializeUI(elements) {
  // Set default text content to prevent blank UI
  const h2 = document.querySelector('.popup-container h2');
  if (h2) h2.textContent = '🎤 AI Voice Dictation';
  if (elements.statusText) elements.statusText.textContent = 'Loading...';
  if (elements.dictateBtn) elements.dictateBtn.innerHTML = 'Start Dictation <span class="shortcut">Ctrl+Shift+1</span>';
  const settingsLink = document.querySelector('#settings-link');
  if (settingsLink) settingsLink.textContent = '⚙️ Settings';
}

async function updateUITranslations(elements) {
      try {
        console.log('Starting UI translations update...');
        
        // Update static UI elements
        const h2 = document.querySelector('.popup-container h2');
        if (h2) h2.textContent = await t('extensionTitle');
        
        // Update button text while preserving shortcut span
        const dictateBtn = elements?.dictateBtn || document.getElementById('dictate-btn');
        if (dictateBtn) {
          const btnText = await t('startDictation');
          const shortcutSpan = dictateBtn.querySelector('.shortcut');
          const shortcutText = shortcutSpan ? shortcutSpan.outerHTML : '<span class="shortcut">Ctrl+Shift+1</span>';
          dictateBtn.innerHTML = btnText + ' ' + shortcutText;
        }
        
        const settingsLinkEl = document.querySelector('#settings-link');
        if (settingsLinkEl) settingsLinkEl.textContent = await t('settingsLink');
        
        // Update tips
        const tipsP = document.querySelector('.tips p');
        if (tipsP) tipsP.innerHTML = '<strong>' + await t('tips') + '</strong>';
        
        const tipsList = document.querySelectorAll('.tips li');
        const shortcutEl = document.querySelector('.actual-shortcut');
        const shortcut = shortcutEl ? shortcutEl.textContent : 'Ctrl+Shift+1';
        
        // Handle tips list with proper safety checks
        const lang = await getCurrentLanguage();
        console.log('Current language:', lang);
        
        // Safely get translations
        const tipsList_translated = translations[lang]?.tipsList || translations.en.tipsList;
        
        if (tipsList_translated && Array.isArray(tipsList_translated)) {
          tipsList.forEach((li, index) => {
            if (index < tipsList_translated.length) {
              if (index === 1) {
                li.innerHTML = tipsList_translated[index].replace('{shortcut}', `<span class="actual-shortcut">${shortcut}</span>`);
              } else {
                li.textContent = tipsList_translated[index];
              }
            }
          });
        }
        
        console.log('UI translations update completed');
      } catch (error) {
        console.error('Error updating UI translations:', error);
      }
    }

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