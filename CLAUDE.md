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
   zip -r voice-dictation-extension.zip manifest.json background.js offscreen.html offscreen.js content.js popup.html popup.js config.html config.js styles.css translations.js _locales -x ".*" -x "__MACOSX" -x "*.md"
   ```

## Project Structure

- `manifest.json` - Chrome extension manifest (v3) with offscreen permission and locale support
- `background.js` - Service worker managing offscreen document and API calls
- `offscreen.html/js` - Offscreen document for audio recording via MediaRecorder
- `content.js` - Content script for UI and text insertion (supports Google search) with multilingual support
- `popup.html/js` - Extension popup interface with dynamic language switching
- `config.html/js` - Settings page with custom model path, system prompt support, and language selector
- `styles.css` - Shared styles for popup and config pages
- `translations.js` - Centralized translation system for English and German
- `_locales/` - Chrome locale files for extension name/description (en, de)
- `voice-dictation-extension.zip` - Packaged extension ready for distribution

## Key Implementation Details

- **API Integration**: Uses Groq API with Whisper Large V3 Turbo for transcription and configurable LLM models for text formatting
- **JSON Response Format**: LLM now returns structured JSON responses for consistent output parsing
- **Custom Models**: Supports both predefined models (including Qwen QWQ 32B) and custom model paths for future Groq model compatibility
- **Custom System Prompts**: Fully customizable AI instructions with reset to default functionality
- **Enhanced System Prompt**: Prevents AI from interpreting dictated text as commands - treats all input as content to be formatted
- **Offscreen Document**: Uses Chrome's offscreen API to handle audio recording in service worker context
- **Context-Aware Formatting**: Detects the current website/app and adjusts writing style accordingly (e.g., formal for Gmail, casual for Slack, works on Google.com)
- **Chrome Storage Sync**: Settings automatically sync across devices using `chrome.storage.sync`
- **Multilingual Support**: Full German and English language support with automatic language detection and synced preferences
- **Keyboard Shortcut**: Default is Ctrl+Shift+1, configurable via chrome://extensions/shortcuts - now with automatic content script injection
- **Extended Token Support**: Increased max tokens from 500 to 6000 for longer dictations
- **Force Mode**: New toggle that allows dictation anywhere, with clipboard fallback when no text field is available
- **Enhanced Recording**: 60-second recording duration with countdown warning in the last 10 seconds
- **Always-Visible Debug Button**: Debug logs are now accessible via a permanent button in the popup (no triple-click needed)

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
  - **Always-visible debug button** - No more triple-clicking needed to access debug logs
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

1. **View Logs**: Click the "🐛 View Debug Logs" button in the popup and check browser console (F12)
2. **Production**: Set `DEBUG = false` in background.js and content.js before distribution
3. **Troubleshooting**: Share console logs when reporting issues for faster diagnosis - logs are automatically copied to clipboard