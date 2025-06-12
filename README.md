# AI Voice Dictation Chrome Extension

A powerful Chrome extension that converts speech to text using AI, with intelligent formatting based on context. Your dictated text is transcribed, formatted appropriately for the current website, and copied to your clipboard.

## 🌟 Key Features

- **🎤 Voice-to-Text**: Speak naturally and get accurately transcribed text
- **🤖 AI-Powered Formatting**: Automatically formats your text based on the website context
- **📋 Clipboard Integration**: Text is copied to clipboard for easy pasting anywhere
- **🌍 Multilingual Support**: Available in English, German, Spanish, and French
- **⚡ Fast & Reliable**: Uses Groq's Whisper for transcription and Qwen QWQ 32B for formatting
- **🔒 Privacy-Focused**: No data storage - all processing via direct API calls
- **⌨️ Keyboard Shortcut**: Quick access with Ctrl+Shift+1

## 📦 Installation

1. Download the extension from the [Chrome Web Store](https://chrome.google.com/webstore) (coming soon)
   
   OR install manually:
   - Download the latest release ZIP file
   - Extract to a folder
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extracted folder

2. Get your free Groq API key:
   - Visit [console.groq.com](https://console.groq.com)
   - Sign up for a free account
   - Generate an API key

3. Configure the extension:
   - Click the extension icon
   - Go to Settings
   - Enter your Groq API key
   - Choose your preferred language

## 🚀 How to Use

1. **Start Dictation**: Click the extension icon or press `Ctrl+Shift+1`
2. **Speak Clearly**: The recording indicator will appear
3. **Stop Recording**: Press `Enter` or `Esc` (or click the indicator)
4. **Paste Your Text**: Press `Ctrl+V` to paste the formatted text anywhere

## 🎯 Smart Formatting

The AI adapts writing style based on the website you're using:

- **Gmail**: Professional, formal tone
- **Slack/Discord**: Casual, friendly style
- **LinkedIn**: Professional networking tone
- **Twitter/X**: Concise, engaging posts
- **Google Docs**: Well-structured documents
- **GitHub**: Technical, precise language
- **And more**: Appropriate formatting for any website

## ⚙️ Settings

- **Language**: Choose from English, German, Spanish, or French
- **AI Model**: Qwen QWQ 32B (recommended) or other Groq models
- **Custom Prompts**: Customize how the AI formats your text
- **Keyboard Shortcut**: Customize via `chrome://extensions/shortcuts`

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

**Extension not working?**
- Ensure microphone permissions are granted
- Check that your API key is valid
- Try refreshing the page

**No sound recording?**
- Check Chrome's microphone settings
- Ensure no other apps are using the microphone

**Text not formatting correctly?**
- The AI adapts to the current website
- Try customizing the system prompt in settings

## 🔒 Privacy

- No audio recordings are stored
- No personal data is collected
- All processing happens via secure API calls to Groq
- Only the current page URL is sent for context (not the content)

## 📝 License

This extension is provided as-is for personal and commercial use.

## 🤝 Support

For issues or feature requests, please visit our [GitHub repository](https://github.com/anthropics/voice-dictation).

---

Made with ❤️ for all Chrome users