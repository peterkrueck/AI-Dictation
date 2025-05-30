// Popup script handles UI interactions

// Import translations
import { t, getCurrentLanguage, translations } from './translations.js';

// Add error handler
window.addEventListener('error', (e) => {
  console.error('Popup script error:', e);
});

console.log('Popup script loaded');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing popup...');
  try {
    const dictateBtn = document.getElementById('dictate-btn');
    const settingsLink = document.getElementById('settings-link');
    const statusText = document.getElementById('status-text');
    const statusDot = document.querySelector('.status-dot');
    const debugBtn = document.getElementById('debug-btn');
    const forceModeToggle = document.getElementById('force-mode-toggle');
    
    // Update UI with translations
    await updateUITranslations();
    
    // Check if API key is set
    chrome.storage.sync.get(['groqApiKey', 'forceDictation'], async (result) => {
      if (!result.groqApiKey) {
        statusText.textContent = await t('statusApiKeyNotSet');
        statusDot.style.backgroundColor = '#FF4444';
        dictateBtn.disabled = true;
      } else {
        statusText.textContent = await t('statusReady');
        statusDot.style.backgroundColor = '#44BB44';
      }
      
      // Set force mode toggle state
      forceModeToggle.checked = result.forceDictation || false;
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
        const helpText = document.createElement('small');
        helpText.style.color = '#666';
        helpText.textContent = ' ' + await t('shortcutHelpText');
        document.querySelector('.actual-shortcut').after(helpText);
      }
    });
    
    // Handle force mode toggle
    forceModeToggle.addEventListener('change', async () => {
      chrome.storage.sync.set({ forceDictation: forceModeToggle.checked }, async () => {
        showNotification(
          forceModeToggle.checked 
            ? await t('forceModeEnabled')
            : await t('forceModeDisabled'), 
          'success'
        );
      });
    });
    
    // Handle debug button (always visible)
    debugBtn.addEventListener('click', async () => {
      chrome.runtime.sendMessage({ action: 'getDebugLogs' }, async (logs) => {
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
          
          navigator.clipboard.writeText(debugText).then(async () => {
            showNotification(await t('debugLogsCopied'), 'success');
          }).catch(async () => {
            showNotification(await t('debugLogsInConsole'), 'success');
          });
        } else {
          console.log('No debug logs found');
        }
        
        console.log('=== End Debug Logs ===');
      });
    });
    
    // Handle dictation button click
    dictateBtn.addEventListener('click', () => {
      console.log('Dictate button clicked');
      // Get active tab and start dictation
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'startDictation'});
        window.close();
      });
    });
    
    // Handle settings link
    settingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Settings link clicked');
      chrome.runtime.openOptionsPage();
    });
    
    async function updateUITranslations() {
      // Update static UI elements
      document.querySelector('.popup-container h2').textContent = await t('extensionTitle');
      document.querySelector('.force-mode-container span').textContent = await t('forceMode');
      document.querySelector('.force-mode-container small').textContent = await t('forceModeDescription');
      
      // Update button text while preserving shortcut span
      const btnText = await t('startDictation');
      const shortcutSpan = dictateBtn.querySelector('.shortcut');
      dictateBtn.innerHTML = btnText + ' ';
      dictateBtn.appendChild(shortcutSpan);
      
      document.querySelector('#settings-link').textContent = await t('settingsLink');
      document.querySelector('#debug-btn').textContent = await t('debugButton');
      
      // Update tips
      document.querySelector('.tips p').innerHTML = '<strong>' + await t('tips') + '</strong>';
      const tipsList = document.querySelectorAll('.tips li');
      const shortcut = document.querySelector('.actual-shortcut').textContent || 'Ctrl+Shift+1';
      const tipsTexts = [
        await t('tipsList', { index: 0 }),
        await t('tipsList', { index: 1 }).replace('{shortcut}', `<span class="actual-shortcut">${shortcut}</span>`),
        await t('tipsList', { index: 2 }),
        await t('tipsList', { index: 3 })
      ];
      
      // Handle array translations
      const lang = await getCurrentLanguage();
      const tipsList_translated = translations[lang].tipsList;
      tipsList.forEach((li, index) => {
        if (index === 1) {
          li.innerHTML = tipsList_translated[index].replace('{shortcut}', `<span class="actual-shortcut">${shortcut}</span>`);
        } else {
          li.textContent = tipsList_translated[index];
        }
      });
    }
  } catch (error) {
    console.error('Error initializing popup:', error);
  }
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