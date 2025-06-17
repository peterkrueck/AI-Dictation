# AI Voice Dictation Chrome Extension

A powerful Chrome extension that converts speech to text using AI, with intelligent formatting based on context. Your dictated text is transcribed, formatted appropriately for the current website, and copied to your clipboard.

## 🌟 Key Features

- **🎤 Voice-to-Text**: Speak naturally and get accurately transcribed text
- **🤖 AI-Powered Formatting**: Automatically formats your text based on the website context
- **📋 Clipboard Integration**: Text is copied to clipboard for easy pasting anywhere
- **🌍 Multilingual Support**: Available in English, German, Spanish, and French
- **⚡ Fast & Reliable**: Uses Groq's Whisper for transcription and Qwen QWQ 32B for formatting
- **🔒 Privacy-Focused**: No data storage - all processing via direct API calls
- **⌨️ Keyboard Shortcut**: Quick access with Cmd+Shift+1 (macOS) or Ctrl+Shift+1 (Windows/Linux/ChromeOS)

## 📋 Prerequisites

Before installing, ensure you have:
- **Chrome 116 or later** (required for audio recording)
- **Operating System**: macOS, Windows, Linux, or ChromeOS
- **Microphone access** (extension will request permission on first use, except on ChromeOS where it typically works automatically)
- **Internet connection** (for AI processing)

> **ChromeOS Users**: This extension is optimized for ChromeOS with enhanced keyboard handling and seamless microphone access.

> **Note for Chromebook/Enterprise users**: Some managed devices may restrict extension installation or microphone access. Contact your administrator if you encounter issues.

## 📦 Installation Guide

### Step 1: Install the Extension

**Option A: Chrome Web Store (Recommended)**
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (coming soon)
2. Click "Add to Chrome"
3. Confirm by clicking "Add extension"

**Option B: Manual Installation**
1. Download the latest release ZIP file
2. Extract the ZIP to a folder on your computer
3. Open Chrome and navigate to `chrome://extensions/`
4. Toggle on "Developer mode" (top-right corner)
5. Click "Load unpacked" and select the extracted folder
6. The extension icon should appear in your Chrome toolbar

### Step 2: Grant Microphone Permission

**Chrome will automatically request microphone access when first using the extension.**

**To grant permission**:
1. When prompted, click "Allow" in the permission dialog
2. The extension will save this permission for future use

**If permission was blocked or needs to be changed**:
1. Look for the 🔒 or 🎤 icon in Chrome's address bar (left side)
2. Click the icon to open site permissions
3. Set "Microphone" to "Allow"
4. Refresh the page

**To manage all Chrome permissions**:
1. Go to `chrome://settings/content/microphone`
2. Ensure microphone access is enabled
3. Add your website domains to "Allowed" if needed

**For system-level microphone issues**:
- **Windows**: Go to Settings > Privacy > Microphone > Allow apps to access microphone
- **macOS**: Go to System Preferences > Security & Privacy > Privacy > Microphone > Check Chrome
- **ChromeOS**: Settings > Advanced > Privacy and security > Site settings > Microphone

### Step 3: Get Your Groq API Key

**Why do I need this?** The extension uses Groq's free AI services for speech recognition and text formatting.

1. **Create Account**: Visit [console.groq.com](https://console.groq.com)
2. **Sign Up**: Click "Sign Up" and create a free account
3. **Generate Key**: 
   - Go to "API Keys" in the dashboard
   - Click "Create API Key"
   - Copy the key (starts with `gsk_...`)
   - **Important**: Save this key securely - you won't see it again!

### Step 4: Configure the Extension

1. **Open Settings**: Click the extension icon → "Settings"
2. **Enter API Key**: Paste your Groq API key
3. **Choose Language**: Select your preferred language (English, German, Spanish, or French)
4. **Personalize (Optional)**: Add your name, addresses, or custom spellings for better accuracy
5. **Save**: Click "Save" to store your settings

### Step 5: Set Up Keyboard Shortcut (Optional)

**Default shortcuts by platform**:
- **macOS**: `Cmd+Shift+1`
- **Windows/Linux/ChromeOS**: `Ctrl+Shift+1`

**To customize**:
1. Go to `chrome://extensions/shortcuts`
2. Find "AI Voice Dictation"
3. Click the pencil icon next to "Start/Stop Dictation"
4. Press your preferred key combination
5. Click outside to save

**Note**: ChromeOS users benefit from additional keyboard handling optimizations for the best experience.

**Tips for choosing shortcuts**:
- Avoid conflicts with browser shortcuts (e.g., Ctrl+T, Ctrl+W)
- Try combinations like Ctrl+Shift+D or Alt+Shift+V
- On macOS, use Cmd instead of Ctrl
- Test your shortcut on different websites to ensure it works

**Alternative trigger**: Always available via the extension icon in your toolbar

## 🚀 How to Use

### First Time Setup Test
1. **Test microphone**: Click the extension icon to verify it loads
2. **Quick test**: Press `Ctrl+Shift+1` and say "Hello, this is a test"
3. **Verify**: Check if the recording indicator appears and text gets copied to clipboard

### Daily Usage Workflow
1. **Start Dictation**: 
   - Press `Ctrl+Shift+1` (anywhere on any webpage)
   - OR click the extension icon in toolbar
2. **Record Your Speech**: 
   - Speak clearly and naturally
   - Red recording indicator shows recording is active
   - You have up to 60 seconds (warning at 50 seconds)
3. **Stop Recording**: 
   - Press `Enter` or `Esc` 
   - OR click the recording indicator
4. **Use Your Text**: 
   - Text is automatically copied to clipboard
   - Press `Ctrl+V` to paste anywhere
   - Green notification confirms text is ready

### Pro Tips
- **Speak naturally**: No need to pause between words
- **Context matters**: The AI adapts to the website you're on
- **Use anywhere**: Works on all websites, even when no text field is selected
- **Multiple languages**: Switch language in settings for better recognition

## 🎯 Smart Formatting

The AI adapts writing style based on the website you're using:

- **Gmail**: Professional, formal tone
- **Slack/Discord**: Casual, friendly style
- **LinkedIn**: Professional networking tone
- **Twitter/X**: Concise, engaging posts
- **Google Docs**: Well-structured documents
- **GitHub**: Technical, precise language
- **And more**: Appropriate formatting for any website

## ⚙️ Settings & Customization

### Essential Settings
- **API Key**: Your Groq API key (required for all functionality)
- **Language**: Choose from English, German, Spanish, or French
- **AI Model**: Qwen QWQ 32B (recommended) or other Groq models

### Personalization (New in v2.1.0)
Make your dictation more accurate by adding:
- **Full Name**: Your name for better recognition
- **Business Name**: Company name if you use it frequently  
- **Home Address**: Your home address
- **Work Address**: Your work address
- **Custom Spellings**: Difficult names, places, or technical terms

### Advanced Options
- **Force Mode**: When enabled, always copies to clipboard (useful for complex websites)
- **Custom Model Path**: Use newer Groq models not in the dropdown
- **Debug Mode**: View logs for troubleshooting (click 🐛 button)
- **Keyboard Shortcut**: Customize via `chrome://extensions/shortcuts`

### Language Switching
- Settings sync across all your Chrome devices
- UI language changes immediately when selected
- Dictation language affects AI transcription accuracy

## 🔧 Technical Details

- **Speech Recognition**: Groq Whisper Large V3 Turbo
- **Text Processing**: Qwen QWQ 32B (32,000 token context)
- **Recording Duration**: Up to 60 seconds
- **Chrome Version**: Requires Chrome 116 or later

## 🆕 What's New in Version 2.0

- **Simplified Workflow**: Text always copies to clipboard - no more text field detection
- **4 Languages**: Added Spanish and French support
- **Better AI Model**: Qwen QWQ 32B is now the default recommendation
- **Cleaner Interface**: Removed complexity for a smoother experience

## 🐛 Troubleshooting

### Extension Won't Load/Install

**Manual installation fails:**
- Ensure you've enabled "Developer mode" in `chrome://extensions/`
- Check that you're selecting the folder (not the ZIP file)
- Try restarting Chrome after installation

**Extension disabled automatically:**
- Some enterprise/school devices block extensions
- Contact your IT administrator for permission
- Check Chrome management policies

### Microphone/Recording Issues

**"No microphone access" error:**
1. Click the 🔒 icon in Chrome's address bar
2. Set "Microphone" to "Allow"
3. Refresh the page and try again

**Recording indicator doesn't appear:**
- Ensure no other apps are using your microphone
- Check Windows/Mac sound settings
- Try unplugging/reconnecting external microphones

**Recording stops immediately:**
- This often happens on managed Chromebooks
- Try enabling "Force Mode" in settings
- Check if background audio apps are interfering

### API/Connection Issues

**"Invalid API key" error:**
- Verify your key starts with `gsk_`
- Make sure you copied the entire key
- Try generating a new key at [console.groq.com](https://console.groq.com)

**"Network error" messages:**
- Check your internet connection
- Verify Groq services are accessible
- Try again in a few minutes

**Slow processing:**
- Groq's free tier may have rate limits
- Try shorter dictations (under 30 seconds)
- Consider upgrading to Groq Pro for faster processing

### Keyboard Shortcut Issues

**Ctrl+Shift+1 not working:**
1. Check if another app is using this shortcut
2. Go to `chrome://extensions/shortcuts` to verify/change
3. On ChromeOS, try different key combinations
4. On macOS, use Cmd+Shift+1 instead
5. Restart Chrome after changing shortcuts

**To troubleshoot shortcut conflicts:**
1. Press the shortcut in different applications to test
2. Check system-wide shortcuts in OS settings:
   - **Windows**: Settings > System > About > Advanced system settings > Environment Variables
   - **macOS**: System Preferences > Keyboard > Shortcuts
   - **ChromeOS**: Settings > Device > Keyboard
3. Try alternative combinations like Ctrl+Alt+D or Ctrl+Shift+V

**Shortcut works but nothing happens:**
- The extension may not be loaded on the current page
- Try refreshing the page or restarting Chrome
- Check if the site has restricted permissions
- Test on a simple page like google.com first

**Global shortcut alternatives:**
- Some users prefer Ctrl+Shift+D or Alt+Shift+V
- Function key combinations like F12 (if not used by DevTools)
- Consider combinations that don't conflict with common browser shortcuts

### Text Insertion Problems

**Text goes to wrong place:**
- Enable "Force Mode" in settings for clipboard-only mode
- This ensures text always goes to clipboard for manual pasting

**Formatted text looks wrong:**
- The AI adapts to each website's context
- Try customizing your personalization settings
- Report specific issues for better training

### Chromebook/Enterprise Device Issues

**Extension blocked by admin:**
- Contact your IT administrator
- Ask them to allowlist the extension
- Some managed devices completely block extensions

**Microphone blocked:**
- Check device management settings
- Some schools/companies restrict microphone access
- Try using on a personal device to verify functionality

### Debug Mode

**For advanced troubleshooting:**
1. Open extension settings
2. Click the "🐛 View Debug Logs" button
3. Open Chrome DevTools (F12)
4. Check the console for detailed error messages
5. Share these logs when reporting issues

### Still Having Issues?

1. **Try incognito mode** - This helps identify extension conflicts
2. **Disable other extensions** - Some extensions can interfere
3. **Update Chrome** - Ensure you have Chrome 116 or later
4. **Clear extension data** - Uninstall and reinstall the extension
5. **Report the issue** - Contact support with debug logs

### Known Limitations

- **Complex websites**: Some sites like Google Docs work better in Force Mode
- **Background noise**: Works best in quiet environments
- **Accents**: Recognition accuracy varies by accent and language
- **Technical terms**: Add custom spellings in settings for better accuracy

## 🔒 Privacy

- No audio recordings are stored
- No personal data is collected
- All processing happens via secure API calls to Groq
- Only the current page URL is sent for context (not the content)

## 📝 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).

- ✅ **Free for personal use**
- ✅ **Free for non-commercial use with attribution**
- ❌ **Commercial use requires explicit permission**

See [LICENSE.md](LICENSE.md) for the full license terms.

## 🤝 Support

For issues or feature requests, please visit our [GitHub repository](https://github.com/anthropics/voice-dictation).

---

Made with ❤️ for all Chrome users