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
   zip -r voice-dictation-extension.zip manifest.json background.js offscreen.html offscreen.js content.js popup.html popup.js config.html config.js styles.css -x ".*" -x "__MACOSX" -x "*.md"
   ```

## Project Structure

- `manifest.json` - Chrome extension manifest (v3) with offscreen permission
- `background.js` - Service worker managing offscreen document and API calls
- `offscreen.html/js` - Offscreen document for audio recording via MediaRecorder
- `content.js` - Content script for UI and text insertion (supports Google search)
- `popup.html/js` - Extension popup interface
- `config.html/js` - Settings page with custom model path and system prompt support
- `styles.css` - Shared styles for popup and config pages
- `voice-dictation-extension.zip` - Packaged extension ready for distribution

## Key Implementation Details

- **API Integration**: Uses Groq API with Whisper Large V3 Turbo for transcription and configurable LLM models for text formatting
- **Custom Models**: Supports both predefined models and custom model paths for future Groq model compatibility
- **Custom System Prompts**: Fully customizable AI instructions with reset to default functionality
- **Offscreen Document**: Uses Chrome's offscreen API to handle audio recording in service worker context
- **Context-Aware Formatting**: Detects the current website/app and adjusts writing style accordingly (e.g., formal for Gmail, casual for Slack, works on Google.com)
- **Chrome Storage Sync**: Settings automatically sync across devices using `chrome.storage.sync`
- **Keyboard Shortcut**: Default is Ctrl+Shift+1, configurable via chrome://extensions/shortcuts

## Testing Approach

Manual testing is required for Chrome extensions:
1. Test microphone permissions handling via offscreen document
2. Verify text insertion works across different input types (input, textarea, contenteditable, role="combobox")
3. Test on various websites including Google.com search to ensure context detection works properly
4. Verify API error handling and fallback behavior
5. Test custom model path functionality
6. Test custom system prompt configuration and reset functionality

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

## Debugging Features

The extension now includes comprehensive debugging capabilities to help diagnose issues, especially on managed Chromebooks:

- **Debug Logging System**: Persistent debug logs saved to chrome.storage.local (last 100 entries) with detailed context and timestamps
- **Platform Detection**: Automatic detection of Chrome version, OS info, and extension management status
- **Permission Monitoring**: Real-time monitoring of microphone permissions and offscreen document status
- **Enhanced Error Reporting**: Detailed error categorization with user-friendly messages and technical details
- **Debug Mode Activation**: Triple-click the extension popup title to enable debug mode
- **Debug Log Viewer**: Click "🔍 View Debug Logs" button to output all logs to browser console
- **Session Tracking**: Unique session IDs and complete message flow monitoring across all extension components

### Using Debug Mode

1. **Enable**: Triple-click the extension title in the popup to activate debug mode
2. **View Logs**: Click the debug button that appears and check browser console (F12)
3. **Production**: Set `DEBUG = false` in background.js and content.js before distribution
4. **Troubleshooting**: Share console logs when reporting issues for faster diagnosis