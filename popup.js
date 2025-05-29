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