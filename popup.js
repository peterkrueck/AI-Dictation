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