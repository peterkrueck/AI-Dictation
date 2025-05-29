// Configuration page script

// Default system prompt
const DEFAULT_SYSTEM_PROMPT = `You are a writing assistant. The user is dictating text for AppName. Adjust style based on app:

Slack/Discord: Casual, friendly
Mail: Professional, formal
Notes: Clear, organized
Code editors: Technical, precise

Fix grammar and spelling and remove filler words or duplications. Format nicely. Match the app's style. Output only corrected, well formated text. In case mentioned by the user here the correct spelling: last name: Krück; hotel: Hotel Haus Sonnschein; hotel address: Kerwerstraße 1, 56812 Cochem`;

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('api-key');
  const modelSelect = document.getElementById('model');
  const customModelGroup = document.getElementById('custom-model-group');
  const customModelInput = document.getElementById('custom-model');
  const saveBtn = document.getElementById('save-btn');
  const saveStatus = document.getElementById('save-status');
  const systemPromptTextarea = document.getElementById('system-prompt');
  const resetPromptBtn = document.getElementById('reset-prompt-btn');
  
  // Load existing settings
  chrome.storage.sync.get(['groqApiKey', 'model', 'customModel', 'systemPrompt'], (result) => {
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
    // Load system prompt or use default
    systemPromptTextarea.value = result.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  });
  
  // Handle model selection change
  modelSelect.addEventListener('change', () => {
    if (modelSelect.value === 'custom') {
      customModelGroup.style.display = 'block';
    } else {
      customModelGroup.style.display = 'none';
    }
  });
  
  // Handle reset prompt button
  resetPromptBtn.addEventListener('click', () => {
    systemPromptTextarea.value = DEFAULT_SYSTEM_PROMPT;
    showStatus('System prompt reset to default', 'success');
  });
  
  // Save settings
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    let model = modelSelect.value;
    const customModel = customModelInput.value.trim();
    const systemPrompt = systemPromptTextarea.value.trim();
    
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
    
    if (!systemPrompt) {
      showStatus('System prompt cannot be empty', 'error');
      return;
    }
    
    chrome.storage.sync.set({
      groqApiKey: apiKey,
      model: model,
      customModel: customModel,
      systemPrompt: systemPrompt
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