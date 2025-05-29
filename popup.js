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
  
  // Add debug mode check
  chrome.storage.local.get(['debugMode'], (result) => {
    if (result.debugMode) {
      addDebugButton();
    }
  });
  
  // Enable debug mode with triple click on title
  let clickCount = 0;
  let clickTimer = null;
  
  document.querySelector('h2').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 3) {
      chrome.storage.local.set({ debugMode: true }, () => {
        addDebugButton();
        showNotification('Debug mode enabled', 'success');
      });
    }
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => clickCount = 0, 500);
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

function addDebugButton() {
  const container = document.querySelector('.popup-container');
  const debugBtn = document.createElement('button');
  debugBtn.textContent = '🔍 View Debug Logs';
  debugBtn.className = 'debug-btn';
  debugBtn.style.cssText = `
    width: 100%;
    margin-top: 10px;
    padding: 8px;
    background: #ff9800;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  debugBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'getDebugLogs' }, (logs) => {
      console.log('=== Debug Logs ===');
      logs.forEach(log => {
        console.log(`[${log.timestamp}] [${log.context}] ${log.message}`, 
          log.data ? JSON.parse(log.data) : '');
      });
      console.log('=== End Debug Logs ===');
      alert('Debug logs printed to console. Press F12 to view.');
    });
  });
  
  container.appendChild(debugBtn);
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
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 2000);
}