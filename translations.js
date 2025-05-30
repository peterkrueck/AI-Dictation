// Translation system for the Voice Dictation extension
const translations = {
  en: {
    // Popup
    extensionTitle: "🎤 AI Voice Dictation",
    statusReady: "Ready",
    statusApiKeyNotSet: "API key not set",
    forceMode: "Force Mode",
    forceModeDescription: "Dictate anywhere, copy to clipboard if needed",
    forceModeEnabled: "Force Mode enabled - dictate anywhere!",
    forceModeDisabled: "Force Mode disabled",
    startDictation: "Start Dictation",
    settingsLink: "⚙️ Settings",
    debugButton: "🐛 View Debug Logs",
    debugLogsCopied: "Debug logs copied to clipboard & console (F12)",
    debugLogsInConsole: "Debug logs in console (F12)",
    tips: "Tips:",
    tipsList: [
      "Click in any text field",
      "Press {shortcut} or click button",
      "Speak clearly",
      "Press Enter/Esc or click to stop"
    ],
    shortcutNotSet: "Not set",
    shortcutHelpText: "(Set in chrome://extensions/shortcuts)",
    
    // Config/Settings
    settingsTitle: "🎤 AI Voice Dictation Settings",
    apiConfigTitle: "Groq API Configuration",
    apiKeyLabel: "Groq API Key:",
    apiKeyPlaceholder: "gsk_...",
    apiKeyHelp: "Get your API key from",
    modelLabel: "LLM Model:",
    modelHelp: "Llama 4 Scout provides the best balance of speed and quality",
    customModelLabel: "Custom Model Path:",
    customModelPlaceholder: "e.g., meta-llama/your-custom-model",
    customModelHelp: "Enter the full model path from Groq's model list",
    saveButton: "Save Settings",
    saveSuccess: "Settings saved successfully!",
    apiKeyRequired: "Please enter an API key",
    apiKeyInvalid: "API key should start with gsk_",
    customModelRequired: "Please enter a custom model path",
    systemPromptEmpty: "System prompt cannot be empty",
    
    // Language settings
    languageTitle: "Language Settings",
    languageLabel: "Interface Language:",
    languageHelp: "Choose your preferred language for the extension interface",
    
    // System prompt
    systemPromptTitle: "AI System Prompt Customization",
    systemPromptLabel: "Custom System Prompt:",
    systemPromptPlaceholder: "Enter your custom system prompt instructions for the AI...",
    systemPromptHelp: "Customize how the AI formats and processes your dictated text. Leave blank to use default behavior.",
    resetPromptButton: "Reset to Default",
    resetPromptHelp: "Click to restore the default system prompt used by the extension",
    resetPromptSuccess: "System prompt reset to default",
    
    // Keyboard shortcut
    keyboardShortcutTitle: "Keyboard Shortcut",
    currentShortcut: "Current shortcut:",
    shortcutNote: "Note: This matches your Mac's Cmd+Shift+1, but uses Ctrl on Chromebook",
    shortcutChange: "To change: Go to chrome://extensions/shortcuts",
    shortcutTip: "💡 Tip: While recording, press Enter or Esc to stop",
    
    // Sync
    syncTitle: "Sync Across Devices",
    syncDescription: "✅ This extension automatically syncs settings across all Chromebooks logged into your Google account.",
    syncInfo: "Your API key and preferences will be available on all your devices!",
    
    // How to use
    howToUseTitle: "How to Use",
    howToUseSteps: [
      "Click in any text field on a website",
      "Press <strong>{shortcut}</strong> (or click extension icon)",
      "Speak your message clearly",
      "Press <strong>Enter</strong> or <strong>Esc</strong> to stop (or click the red indicator)",
      "Your formatted text will appear automatically"
    ],
    
    // New features
    newFeaturesTitle: "New Features:",
    newFeatures: [
      "✨ <strong>Filler word removal</strong> - \"um\", \"uh\", duplications are automatically removed",
      "📝 <strong>Smart formatting</strong> - Text is nicely formatted based on context",
      "⌨️ <strong>Quick stop</strong> - Press Enter or Esc while recording",
      "🔄 <strong>Auto-sync</strong> - Settings sync across all your Chromebooks"
    ],
    
    // Supported sites
    supportedSitesTitle: "Supported Sites",
    supportedSitesDescription: "The extension adapts its writing style for:",
    supportedSitesList: [
      "<strong>Email</strong> - Gmail: Professional, formal tone",
      "<strong>Chat</strong> - Slack, Discord: Casual, friendly style",
      "<strong>Social</strong> - LinkedIn, Twitter/X, Facebook, Reddit: Platform-appropriate",
      "<strong>Docs</strong> - Google Docs: Well-structured writing",
      "<strong>Notes</strong> - Google Keep, Evernote, OneNote: Clear, organized",
      "<strong>Code</strong> - GitHub, Colab, Replit, CodePen: Technical, precise",
      "<strong>Work</strong> - Jira, Asana, Trello, Notion, Figma: Professional",
      "<strong>Any other website</strong> - Standard, clear writing"
    ],
    
    // About
    aboutTitle: "About",
    version: "Version:",
    model: "Model:",
    modelDescription: "Using Groq's latest Llama 4 Scout 17B model",
    privacy: "Privacy:",
    privacyDescription: "All processing is done via direct API calls. No data is stored.",
    madeWith: "Made with ❤️ for Dad's Chromebook",
    
    // Content script messages
    recordingIndicator: "Recording... Press Enter/Esc or click to stop",
    recordingTimeRemaining: "{seconds}s remaining",
    noTextFieldError: "Please click in a text field first, or enable \"Force Mode\" in the extension popup to dictate anywhere.",
    forceModeInfo: "Force Mode: Text will be copied to clipboard",
    textCopiedSuccess: "✅ Text copied to clipboard! Press Ctrl+V to paste.",
    clipboardError: "Could not copy to clipboard. Text: {text}",
    directInsertError: "Could not insert directly. Text copied to clipboard - press Ctrl+V to paste.",
    insertError: "Could not insert text",
    extensionError: "Extension error: {error}",
    error: "Error: {error}"
  },
  
  de: {
    // Popup
    extensionTitle: "🎤 KI-Sprachdiktat",
    statusReady: "Bereit",
    statusApiKeyNotSet: "API-Schlüssel nicht gesetzt",
    forceMode: "Überall-Modus",
    forceModeDescription: "Überall diktieren, bei Bedarf in Zwischenablage kopieren",
    forceModeEnabled: "Überall-Modus aktiviert - überall diktieren!",
    forceModeDisabled: "Überall-Modus deaktiviert",
    startDictation: "Diktat starten",
    settingsLink: "⚙️ Einstellungen",
    debugButton: "🐛 Debug-Logs anzeigen",
    debugLogsCopied: "Debug-Logs in Zwischenablage & Konsole kopiert (F12)",
    debugLogsInConsole: "Debug-Logs in Konsole (F12)",
    tips: "Tipps:",
    tipsList: [
      "In ein Textfeld klicken",
      "{shortcut} drücken oder Button klicken",
      "Deutlich sprechen",
      "Enter/Esc drücken oder klicken zum Beenden"
    ],
    shortcutNotSet: "Nicht gesetzt",
    shortcutHelpText: "(Einstellen unter chrome://extensions/shortcuts)",
    
    // Config/Settings
    settingsTitle: "🎤 KI-Sprachdiktat Einstellungen",
    apiConfigTitle: "Groq API-Konfiguration",
    apiKeyLabel: "Groq API-Schlüssel:",
    apiKeyPlaceholder: "gsk_...",
    apiKeyHelp: "Holen Sie Ihren API-Schlüssel von",
    modelLabel: "LLM-Modell:",
    modelHelp: "Llama 4 Scout bietet die beste Balance aus Geschwindigkeit und Qualität",
    customModelLabel: "Benutzerdefinierter Modellpfad:",
    customModelPlaceholder: "z.B. meta-llama/ihr-custom-modell",
    customModelHelp: "Geben Sie den vollständigen Modellpfad aus Groqs Modellliste ein",
    saveButton: "Einstellungen speichern",
    saveSuccess: "Einstellungen erfolgreich gespeichert!",
    apiKeyRequired: "Bitte geben Sie einen API-Schlüssel ein",
    apiKeyInvalid: "API-Schlüssel sollte mit gsk_ beginnen",
    customModelRequired: "Bitte geben Sie einen benutzerdefinierten Modellpfad ein",
    systemPromptEmpty: "System-Prompt darf nicht leer sein",
    
    // Language settings
    languageTitle: "Spracheinstellungen",
    languageLabel: "Oberflächensprache:",
    languageHelp: "Wählen Sie Ihre bevorzugte Sprache für die Erweiterungsoberfläche",
    
    // System prompt
    systemPromptTitle: "KI-System-Prompt Anpassung",
    systemPromptLabel: "Benutzerdefinierter System-Prompt:",
    systemPromptPlaceholder: "Geben Sie Ihre benutzerdefinierten System-Prompt-Anweisungen für die KI ein...",
    systemPromptHelp: "Passen Sie an, wie die KI Ihren diktierten Text formatiert und verarbeitet. Leer lassen für Standardverhalten.",
    resetPromptButton: "Auf Standard zurücksetzen",
    resetPromptHelp: "Klicken Sie, um den Standard-System-Prompt der Erweiterung wiederherzustellen",
    resetPromptSuccess: "System-Prompt auf Standard zurückgesetzt",
    
    // Keyboard shortcut
    keyboardShortcutTitle: "Tastenkombination",
    currentShortcut: "Aktuelle Tastenkombination:",
    shortcutNote: "Hinweis: Dies entspricht Cmd+Shift+1 auf Mac, verwendet aber Strg auf Chromebook",
    shortcutChange: "Zum Ändern: Gehen Sie zu chrome://extensions/shortcuts",
    shortcutTip: "💡 Tipp: Während der Aufnahme Enter oder Esc drücken zum Beenden",
    
    // Sync
    syncTitle: "Geräteübergreifende Synchronisierung",
    syncDescription: "✅ Diese Erweiterung synchronisiert Einstellungen automatisch über alle Chromebooks, die mit Ihrem Google-Konto angemeldet sind.",
    syncInfo: "Ihr API-Schlüssel und Ihre Einstellungen sind auf allen Ihren Geräten verfügbar!",
    
    // How to use
    howToUseTitle: "Bedienung",
    howToUseSteps: [
      "In ein Textfeld auf einer Website klicken",
      "<strong>{shortcut}</strong> drücken (oder auf Erweiterungssymbol klicken)",
      "Ihre Nachricht deutlich sprechen",
      "<strong>Enter</strong> oder <strong>Esc</strong> drücken zum Beenden (oder auf rote Anzeige klicken)",
      "Ihr formatierter Text erscheint automatisch"
    ],
    
    // New features
    newFeaturesTitle: "Neue Funktionen:",
    newFeatures: [
      "✨ <strong>Füllwörter-Entfernung</strong> - \"ähm\", \"äh\", Duplikate werden automatisch entfernt",
      "📝 <strong>Intelligente Formatierung</strong> - Text wird je nach Kontext formatiert",
      "⌨️ <strong>Schnelles Beenden</strong> - Enter oder Esc während der Aufnahme drücken",
      "🔄 <strong>Auto-Sync</strong> - Einstellungen synchronisieren über alle Ihre Chromebooks"
    ],
    
    // Supported sites
    supportedSitesTitle: "Unterstützte Seiten",
    supportedSitesDescription: "Die Erweiterung passt ihren Schreibstil an für:",
    supportedSitesList: [
      "<strong>E-Mail</strong> - Gmail: Professioneller, formeller Ton",
      "<strong>Chat</strong> - Slack, Discord: Lockerer, freundlicher Stil",
      "<strong>Soziale Medien</strong> - LinkedIn, Twitter/X, Facebook, Reddit: Plattform-angemessen",
      "<strong>Dokumente</strong> - Google Docs: Gut strukturiertes Schreiben",
      "<strong>Notizen</strong> - Google Keep, Evernote, OneNote: Klar, organisiert",
      "<strong>Code</strong> - GitHub, Colab, Replit, CodePen: Technisch, präzise",
      "<strong>Arbeit</strong> - Jira, Asana, Trello, Notion, Figma: Professionell",
      "<strong>Jede andere Website</strong> - Standard, klares Schreiben"
    ],
    
    // About
    aboutTitle: "Über",
    version: "Version:",
    model: "Modell:",
    modelDescription: "Verwendet Groqs neuestes Llama 4 Scout 17B Modell",
    privacy: "Datenschutz:",
    privacyDescription: "Alle Verarbeitung erfolgt über direkte API-Aufrufe. Keine Daten werden gespeichert.",
    madeWith: "Mit ❤️ für Papas Chromebook gemacht",
    
    // Content script messages
    recordingIndicator: "Aufnahme... Enter/Esc drücken oder klicken zum Beenden",
    recordingTimeRemaining: "Noch {seconds}s",
    noTextFieldError: "Bitte erst in ein Textfeld klicken oder \"Überall-Modus\" im Erweiterungs-Popup aktivieren, um überall zu diktieren.",
    forceModeInfo: "Überall-Modus: Text wird in Zwischenablage kopiert",
    textCopiedSuccess: "✅ Text in Zwischenablage kopiert! Strg+V zum Einfügen drücken.",
    clipboardError: "Konnte nicht in Zwischenablage kopieren. Text: {text}",
    directInsertError: "Konnte nicht direkt einfügen. Text in Zwischenablage kopiert - Strg+V zum Einfügen drücken.",
    insertError: "Konnte Text nicht einfügen",
    extensionError: "Erweiterungsfehler: {error}",
    error: "Fehler: {error}"
  }
};

// Helper function to get current language
function getCurrentLanguage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['language'], (result) => {
      resolve(result.language || 'en');
    });
  });
}

// Helper function to get translation
async function t(key, replacements = {}) {
  const lang = await getCurrentLanguage();
  let text = translations[lang]?.[key] || translations.en[key] || key;
  
  // Replace placeholders
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
  });
  
  return text;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { translations, getCurrentLanguage, t };
}