// Content script runs in web pages and handles text insertion
let recordingIndicator = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startDictation') {
    startDictation();
  }
});

function startDictation() {
  // Get the currently focused element
  const activeElement = document.activeElement;
  
  // Check if it's a text input field
  if (!isTextInput(activeElement)) {
    showNotification('Please click in a text field first', 'error');
    return;
  }
  
  // Show recording indicator
  showRecordingIndicator();
  
  // Request recording from background script
  chrome.runtime.sendMessage({action: 'startRecording'}, (response) => {
    hideRecordingIndicator();
    
    if (response.success) {
      insertText(activeElement, response.text);
      showNotification('Dictation complete!', 'success');
    } else {
      showNotification('Error: ' + response.error, 'error');
    }
  });
}

function isTextInput(element) {
  const tagName = element.tagName.toLowerCase();
  
  // Check for standard input elements
  if (tagName === 'textarea') return true;
  if (tagName === 'input') {
    const type = element.type.toLowerCase();
    return ['text', 'email', 'search', 'url', 'tel', 'password'].includes(type);
  }
  
  // Check for contenteditable elements
  if (element.contentEditable === 'true') return true;
  
  // Check for common WYSIWYG editors
  if (element.classList.contains('ql-editor') || // Quill
      element.classList.contains('trix-content') || // Trix
      element.classList.contains('ProseMirror') || // ProseMirror
      element.classList.contains('editable') || // Generic
      element.getAttribute('role') === 'textbox' ||
      element.getAttribute('role') === 'combobox') { // Google search uses this
    return true;
  }
  
  // Special check for Google search which might use shadow DOM
  if (window.location.hostname.includes('google.com') && 
      (element.name === 'q' || element.classList.contains('gLFyf'))) {
    return true;
  }
  
  return false;
}

function insertText(element, text) {
  // Save current selection
  const start = element.selectionStart;
  const end = element.selectionEnd;
  
  if (element.tagName.toLowerCase() === 'textarea' || 
      element.tagName.toLowerCase() === 'input') {
    // Standard input/textarea
    const currentValue = element.value;
    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
    
    element.value = newValue;
    element.selectionStart = element.selectionEnd = start + text.length;
    
    // Trigger input event for frameworks
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // ContentEditable or other rich text
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // Move cursor to end of inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  // Focus the element
  element.focus();
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
    z-index: 999999;
  `;
  
  const dot = recordingIndicator.querySelector('.recording-dot');
  dot.style.cssText = `
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  const stopRecordingAndHide = () => {
    chrome.runtime.sendMessage({action: 'stopRecording'});
    hideRecordingIndicator();
  };
  
  recordingIndicator.onclick = stopRecordingAndHide;
  
  // Add keyboard listener for Esc and Enter
  const keyboardHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      stopRecordingAndHide();
      document.removeEventListener('keydown', keyboardHandler, true);
    }
  };
  
  // Add keyboard listener with capture to ensure we get the event first
  document.addEventListener('keydown', keyboardHandler, true);
  
  // Store the handler so we can remove it
  recordingIndicator.keyboardHandler = keyboardHandler;
  
  document.body.appendChild(recordingIndicator);
  
  // Focus on the indicator for accessibility
  recordingIndicator.tabIndex = -1;
  recordingIndicator.focus();
}

function hideRecordingIndicator() {
  if (recordingIndicator) {
    // Remove keyboard listener if it exists
    if (recordingIndicator.keyboardHandler) {
      document.removeEventListener('keydown', recordingIndicator.keyboardHandler, true);
    }
    recordingIndicator.remove();
    recordingIndicator = null;
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#FF4444' : '#44BB44'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 999999;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add slide animations
const animStyle = document.createElement('style');
animStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(animStyle);