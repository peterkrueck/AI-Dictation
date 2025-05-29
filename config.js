// Configuration page script

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('api-key');
  const modelSelect = document.getElementById('model');
  const customModelGroup = document.getElementById('custom-model-group');
  const customModelInput = document.getElementById('custom-model');
  const saveBtn = document.getElementById('save-btn');
  const saveStatus = document.getElementById('save-status');
  
  // Load existing settings
  chrome.storage.sync.get(['groqApiKey', 'model', 'customModel'], (result) => {
    if (result.groqApiKey) {
      apiKeyInput.value = result.groqApiKey;
    }
    if (result.model) {
      if (result.model === 'custom' || 
          (!Array.from(modelSelect.options).some(opt => opt.value === result.model) && result.model !== 'custom')) {
        modelSelect.value = 'custom';
        customModelGroup.style.display = 'block';
        customModelInput.value = result.customModel || result.model;
      } else {
        modelSelect.value = result.model;
      }
    }
  });
  
  // Handle model selection change
  modelSelect.addEventListener('change', () => {
    if (modelSelect.value === 'custom') {
      customModelGroup.style.display = 'block';
    } else {
      customModelGroup.style.display = 'none';
    }
  });
  
  // Save settings
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    let model = modelSelect.value;
    const customModel = customModelInput.value.trim();
    
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }
    
    if (!apiKey.startsWith('gsk_')) {
      showStatus('API key should start with gsk_', 'error');
      return;
    }
    
    if (model === 'custom') {
      if (!customModel) {
        showStatus('Please enter a custom model path', 'error');
        return;
      }
      model = customModel;
    }
    
    chrome.storage.sync.set({
      groqApiKey: apiKey,
      model: model,
      customModel: customModel
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