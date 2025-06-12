# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome Extension project for AI-powered voice dictation using Groq API. The extension allows users to dictate text using voice commands, which are then transcribed and intelligently formatted based on the context of the application being used.

## Architecture

The extension follows Chrome's Manifest V3 architecture with the following key components:

- **background.js**: Service worker that manages audio recording via offscreen document, API communication with Groq (Whisper for transcription, LLM for formatting), and message passing
- **offscreen.html/js**: Offscreen document that handles actual audio recording using MediaRecorder API (required since service workers can't access getUserMedia)
- **content.js**: Content script injected into web pages that detects text input fields (including Google search), shows recording UI, and inserts formatted text
- **popup.html/js**: Extension popup interface for quick access to dictation functionality
- **config.html/js**: Settings page for API key configuration, model selection, custom model path support, and custom system prompt configuration

## Development Commands

This is a static Chrome extension project with no build process required. To develop:

1. **Load extension in Chrome**:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project directory

2. **Test the extension**:
   - Click in any text field on a webpage
   - Press Ctrl+Shift+1 or click the extension icon
   - Speak clearly and press Enter/Esc to stop recording

3. **Package for distribution**:
   ```bash
   zip -r voice-dictation-extension.zip manifest.json background.js offscreen.html offscreen.js content.js popup.html popup.js config.html config.js styles.css translations.js README.md _locales icons -x ".*" -x "__MACOSX" -x "CLAUDE.md"
   ```

## Project Structure

```
Voice Dictation/
├── CLAUDE.md                      # Master AI context file (this file)
├── README.md                      # User-facing documentation 
├── manifest.json                  # Chrome extension manifest (v3) with offscreen permission and locale support
├── background.js                  # Service worker managing offscreen document and API calls
├── offscreen.html                 # Offscreen document for audio recording
├── offscreen.js                   # Offscreen document audio recording logic via MediaRecorder
├── content.js                     # Content script for UI and clipboard integration with multilingual support
├── popup.html                     # Extension popup interface HTML
├── popup.js                       # Extension popup interface logic with dynamic language switching
├── config.html                    # Settings page HTML
├── config.js                      # Settings page with custom model path, system prompt support, and language selector
├── styles.css                     # Shared styles for popup and config pages
├── translations.js                # Centralized translation system for English, German, Spanish, and French
├── _locales/                      # Chrome locale files for extension name/description
│   ├── en/
│   │   └── messages.json          # English locale
│   ├── de/
│   │   └── messages.json          # German locale
│   ├── es/
│   │   └── messages.json          # Spanish locale
│   └── fr/
│       └── messages.json          # French locale
├── icons/                         # Extension icons for Chrome Web Store and notifications
│   ├── icon16.png                 # 16x16 icon
│   ├── icon48.png                 # 48x48 icon
│   ├── icon128.png                # 128x128 icon
│   └── icon.svg                   # Source SVG icon
└── docs/                          # Documentation and archived versions
```

## Key Implementation Details

- **API Integration**: Uses Groq API with Whisper Large V3 Turbo for transcription and configurable LLM models for text formatting
- **JSON Response Format**: LLM now returns structured JSON responses for consistent output parsing
- **Custom Models**: Supports both predefined models (including Qwen QWQ 32B) and custom model paths for future Groq model compatibility
- **Custom System Prompts**: Fully customizable AI instructions with reset to default functionality
- **Enhanced System Prompt**: Prevents AI from interpreting dictated text as commands - treats all input as content to be formatted
- **Offscreen Document**: Uses Chrome's offscreen API to handle audio recording in service worker context
- **Clipboard-Only Approach**: All dictated text is copied to clipboard for maximum reliability and flexibility
- **Context-Aware Formatting**: Detects the current website/app and adjusts writing style accordingly (e.g., formal for Gmail, casual for Slack)
- **Chrome Storage Sync**: Settings automatically sync across devices using `chrome.storage.sync`
- **Multilingual Support**: Full support for English, German, Spanish, and French with synced preferences
- **Keyboard Shortcut**: Default is Ctrl+Shift+1, configurable via chrome://extensions/shortcuts
- **Extended Token Support**: Supports up to 6000 tokens for longer dictations
- **Enhanced Recording**: 60-second recording duration with countdown warning in the last 10 seconds
- **Double-Press Prevention**: Prevents accidental double keyboard shortcut presses with debouncing and active recording state management
- **Debug Button in Settings**: Debug logs button moved to settings page for cleaner main UI

## Testing Approach

Manual testing is required for Chrome extensions:
1. Test microphone permissions handling via offscreen document
2. Verify text insertion works across different input types (input, textarea, contenteditable, role="combobox")
3. Test on various websites including Google.com search to ensure context detection works properly
4. Verify API error handling and fallback behavior
5. Test custom model path functionality
6. Test custom system prompt configuration and reset functionality
7. Test JSON response parsing with command-like dictations (e.g., "Can you help me schedule a meeting?")
8. Test with Qwen QWQ 32B model option
9. Verify longer dictations work with increased token limit
10. Test language switching between English and German
11. Verify all UI elements update correctly when switching languages
12. Ensure language preference syncs across devices
13. Test double-press prevention by rapidly pressing Ctrl+Shift+1 multiple times and verify only one recording starts
14. Verify warning notification appears when attempting to start recording while one is already active

## Recent Fixes

- Fixed "getUserMedia" error by implementing offscreen document for audio recording
- Added Google.com search bar compatibility by detecting role="combobox" elements
- Added support for custom Groq model paths for future-proofing
- Added Llama 4 Maverick model to predefined options
- Fixed base64 decoding error by improving error handling between offscreen document and background script
- **Fixed "Only a single offscreen document may be created" error** by implementing proper document existence checking
- **Enhanced universal text field support** - Now works reliably on Gmail, Google.com, and all websites
- **Added Chrome 116+ requirement** for proper offscreen API support
- **Improved text insertion** with multiple fallback methods and clipboard support
- **Better error handling** throughout the extension with clear user notifications
- **Added comprehensive debugging system** for diagnosing permission issues on Chromebooks and managed devices
- **Added custom system prompt configuration** - Users can now fully customize AI formatting instructions with reset to default functionality
- **Updated default system prompt** - Now uses proven formatting instructions from macOS Shortcuts version with personal context support
- **Implemented JSON response format** - LLM now returns structured JSON for consistent output parsing
- **Enhanced system prompt** - Explicitly prevents AI from interpreting dictated text as commands or questions
- **Added Qwen QWQ 32B model** - New model option available in settings
- **Increased token limit** - Extended from 500 to 6000 tokens for longer dictations
- **Added private address** - Included Waldweg 17, 56812 Dohr in spelling corrections
- **Version 1.1 Updates**:
  - **Fixed keyboard shortcut** - Now reliably works with automatic content script injection
  - **Added Force Mode** - Toggle to dictate anywhere with clipboard fallback when no text field is available
  - **Extended recording time** - Increased from 30 to 60 seconds with countdown warning
  - **Debug button added** - Debug logs button added to settings page for troubleshooting
  - **Improved text field detection** - Better support for finding and tracking text input elements
- **Version 1.2 Updates**:
  - **Multilingual Support** - Full German and English language support
  - **Language Selector** - New language dropdown in settings
  - **Synced Language Preference** - Language choice syncs across all devices
  - **Localized Extension Metadata** - Extension name and description support both languages
- **Version 1.2.2 Updates**:
  - **Enhanced URL Context** - System prompt now includes the current URL for better context-aware formatting
  - **Improved App Detection** - LLM can now see the exact website URL to format text more appropriately
  - **Updated Default System Prompt** - More detailed style guide that references actual URLs instead of generic app names
- **Version 1.2.3 Updates**:
  - **Fixed Google Docs Text Insertion** - Completely fixed the issue where text was inserted into the document title instead of the body
  - **Enhanced Keyboard Event Handling** - Improved ESC/Enter key capture on complex sites like Google Docs and Telekom Email
  - **Google Docs Special Handling** - Extension now uses clipboard-only mode for Google Docs to prevent title field insertion
  - **Site-Specific Text Insertion** - Added specialized handlers for Google Docs and Telekom Email with iframe support
  - **Green Success Notifications** - Added bright green "text ready" notifications for better user feedback when using clipboard
  - **Simplified Event Handlers** - Streamlined keyboard event capture based on code review feedback
  - **Enhanced Error Handling** - Better fallback mechanisms and user-friendly error messages
  - **Improved Text Field Detection** - More robust detection of text input areas across complex web applications
- **Version 1.3 Updates**:
  - **Enhanced Force Mode** - When Force Mode is enabled, LLM output is ALWAYS copied to clipboard instead of attempting text insertion
  - **Improved Force Mode Notifications** - Added dedicated "Output copied to clipboard! Please insert via Ctrl+V" notification for Force Mode
  - **Brighter Success Notifications** - Enhanced clipboard success notifications with brighter green color (#00C851) for better visibility
  - **Multilingual Force Mode Messages** - Force Mode clipboard notifications available in both English and German
  - **Simplified Force Mode Workflow** - Eliminates text field detection complexity when Force Mode is active, ensuring consistent clipboard behavior
- **Version 1.4 Updates**:
  - **Fixed JSON Output Issue** - Added `response_format: { type: 'json_object' }` parameter to Groq API request to eliminate thinking tokens in output
  - **Clean Text Output** - Extension now properly outputs only the formatted text without JSON wrappers or thinking tokens
  - **Consistent API Behavior** - Aligned Chrome extension with macOS Shortcuts version for consistent JSON response handling
  - **ChromeOS Keyboard Shortcuts Fix** - Fixed Ctrl+Shift+1 not working reliably on ChromeOS devices
  - **Enhanced Global Event Handling** - Added ChromeOS-specific keyboard event capture for better compatibility
  - **Improved ESC/Enter Key Handling** - Fixed recording stop keys (ESC/Enter) not working during dictation on ChromeOS
  - **Added Notification Support** - Users now receive clear notifications when trying to use extension on restricted pages
  - **Better Error Messages** - Enhanced error handling with user-friendly notifications for common issues
  - **Content Script Injection** - Improved reliability of content script loading with verification and timeout handling
  - **Icon Support Added** - Added proper extension icons for notifications and Chrome Web Store
  - **Fixed API Compatibility Issue** - Changed default model to `qwen-qwq-32b` and enhanced error logging for better API debugging
  - **Enhanced Debug Logging** - Added comprehensive request/response logging in processAudio function for troubleshooting API issues
  - **Model Selection Fix** - Corrected default model selection to match available Groq models and user preferences
- **Version 1.4.1 Updates**:
  - **Fixed ChromeOS ESC/Enter Key Issue** - Completely resolved keyboard event handling on ChromeOS devices during recording
  - **Added Idempotency Protection** - Prevents double-calling of stopRecording function with isStoppingRecording flag
  - **Focused Indicator Approach** - Recording indicator now receives focus to reliably capture keyboard events
  - **Enhanced Visual Feedback** - Users see indicator scale animation when ESC/Enter keys are detected
  - **ChromeOS-Specific Backup Handler** - Added global capture handler specifically for ChromeOS devices
  - **Improved Translation Strings** - More prominent keyboard shortcut instructions in recording indicator
  - **Proper Event Cleanup** - All keyboard event listeners are properly removed when recording stops
  - **Reliable Key Detection** - ESC and Enter keys now work consistently in Force Mode on ChromeOS
- **Version 1.4.2 Updates**:
  - **Fixed Force Mode Text Field Requirement** - Force Mode now works without requiring a text field to be selected
  - **Enhanced Force Mode Logic** - When Force Mode is enabled, text field detection is completely bypassed
  - **Improved User Experience** - Users can now dictate anywhere immediately when Force Mode is active
  - **Keyboard Shortcut Compatibility** - Ctrl+Shift+1 now works everywhere with Force Mode, no text field needed
- **Version 1.4.3 Updates**:
  - **Complete Force Mode Fix** - Removed residual text field check that was still blocking Force Mode functionality
  - **True Anywhere Dictation** - When Force Mode is enabled, dictation now starts immediately without any text field requirements
  - **Streamlined Code Path** - Force Mode now completely bypasses the text field detection logic for faster startup
- **Version 2.0.1 Updates**:
  - **Double-Press Prevention** - Added protection against accidental double keyboard shortcut presses (Ctrl+Shift+1) causing multiple recording attempts
  - **Recording State Management** - Implemented `isRecordingActive` flag to prevent new recordings while one is already in progress
  - **Debouncing Logic** - Added 1-second debounce period to ignore rapid double-press events within RECORDING_DEBOUNCE_MS timeframe
  - **User Feedback** - Added multilingual warning notifications when user attempts to start recording while one is already active
  - **Robust State Reset** - Recording active flag is properly reset on completion, error, or recording stop to ensure clean state management
  - **Enhanced UX** - Users now receive clear feedback instead of confusing double-recording behavior when accidentally double-pressing shortcut

## Debugging Features

The extension now includes comprehensive debugging capabilities to help diagnose issues, especially on managed Chromebooks:

- **Debug Logging System**: Persistent debug logs saved to chrome.storage.local (last 100 entries) with detailed context and timestamps
- **Platform Detection**: Automatic detection of Chrome version, OS info, and extension management status
- **Permission Monitoring**: Real-time monitoring of microphone permissions and offscreen document status
- **Enhanced Error Reporting**: Detailed error categorization with user-friendly messages and technical details
- **Debug Log Viewer**: Click "🐛 View Debug Logs" button (always visible) to output all logs to browser console
- **Session Tracking**: Unique session IDs and complete message flow monitoring across all extension components
- **Clipboard Copy**: Debug logs are automatically copied to clipboard when viewing for easy sharing

### Using Debug Mode

1. **View Logs**: Click the "🐛 View Debug Logs" button in the settings page (config.html) and check browser console (F12)
2. **Production**: Set `DEBUG = false` in background.js and content.js before distribution
3. **Troubleshooting**: Share console logs when reporting issues for faster diagnosis - logs are automatically copied to clipboard