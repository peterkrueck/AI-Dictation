// Translation system for the Voice Dictation extension
export const translations = {
  en: {
    // Popup
    extensionTitle: "🎤 AI Voice Dictation",
    statusReady: "Ready",
    statusApiKeyNotSet: "API key not set",
    startDictation: "Start Dictation",
    settingsLink: "⚙️ Settings",
    debugButton: "🐛 View Debug Logs",
    debugLogsCopied: "Debug logs copied to clipboard & console (F12)",
    debugLogsInConsole: "Debug logs in console (F12)",
    tips: "Tips:",
    tipsList: [
      "Click button or press {shortcut}",
      "Speak clearly",
      "Press Enter/Esc or click to stop",
      "Text is copied to clipboard - paste with Ctrl+V"
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
    systemPromptHelp: "Customize how the AI processes your dictated text. The detected application name and current page URL will be automatically provided to the AI after your custom prompt (e.g., as 'Current application context: Gmail' and 'Current URL: https://mail.google.com'). Your prompt should instruct the AI on how to use this information. The default prompt provides an example of this.",
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
    privacyDescription: "All processing, including the URL of the active page for contextual formatting, is done via direct API calls to Groq. The extension does not store your dictation audio or full URLs. Please refer to Groq's privacy policy for how they handle API data.",
    madeWith: "Made with ❤️ for Dad's Chromebook",
    
    // Debug
    debugTitle: "Debug Tools",
    debugHelp: "Click to output debug logs to browser console for troubleshooting",
    
    // Content script messages
    recordingIndicator: "Recording... Press Enter/Esc or click to stop",
    recordingTimeRemaining: "{seconds}s remaining",
    clipboardModeInfo: "Recording... Your text will be copied to clipboard",
    textCopiedSuccess: "✅ Text ready! Press Ctrl+V to paste",
    clipboardError: "Could not copy to clipboard. Text: {text}",
    extensionError: "Extension error: {error}",
    error: "Error: {error}"
  },
  
  de: {
    // Popup
    extensionTitle: "🎤 KI-Sprachdiktat",
    statusReady: "Bereit",
    statusApiKeyNotSet: "API-Schlüssel nicht gesetzt",
    startDictation: "Diktat starten",
    settingsLink: "⚙️ Einstellungen",
    debugButton: "🐛 Debug-Logs anzeigen",
    debugLogsCopied: "Debug-Logs in Zwischenablage & Konsole kopiert (F12)",
    debugLogsInConsole: "Debug-Logs in Konsole (F12)",
    tips: "Tipps:",
    tipsList: [
      "Button klicken oder {shortcut} drücken",
      "Deutlich sprechen",
      "Enter/Esc drücken oder klicken zum Beenden",
      "Text wird in Zwischenablage kopiert - mit Strg+V einfügen"
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
    systemPromptHelp: "Passen Sie an, wie die KI Ihren diktierten Text verarbeitet. Der erkannte Anwendungsname und die aktuelle Seiten-URL werden der KI automatisch nach Ihrem benutzerdefinierten Prompt bereitgestellt (z.B. als 'Current application context: Gmail' und 'Current URL: https://mail.google.com'). Ihr Prompt sollte die KI anleiten, wie diese Informationen verwendet werden sollen. Der Standard-Prompt enthält hierfür ein Beispiel.",
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
    privacyDescription: "Die gesamte Verarbeitung, einschließlich der URL der aktiven Seite zur kontextbezogenen Formatierung, erfolgt über direkte API-Aufrufe an Groq. Die Erweiterung speichert weder Ihre Diktat-Audioaufnahmen noch vollständige URLs. Informationen zum Umgang mit API-Daten durch Groq entnehmen Sie bitte deren Datenschutzrichtlinien.",
    madeWith: "Mit ❤️ für Papas Chromebook gemacht",
    
    // Debug
    debugTitle: "Debug-Werkzeuge",
    debugHelp: "Klicken Sie, um Debug-Logs zur Fehlerbehebung in der Browser-Konsole auszugeben",
    
    // Content script messages
    recordingIndicator: "Aufnahme... Enter/Esc drücken oder klicken zum Beenden",
    recordingTimeRemaining: "Noch {seconds}s",
    clipboardModeInfo: "Aufnahme... Ihr Text wird in die Zwischenablage kopiert",
    textCopiedSuccess: "✅ Text bereit! Strg+V zum Einfügen drücken",
    clipboardError: "Konnte nicht in Zwischenablage kopieren. Text: {text}",
    extensionError: "Erweiterungsfehler: {error}",
    error: "Fehler: {error}"
  },
  
  es: {
    // Popup
    extensionTitle: "🎤 Dictado de Voz con IA",
    statusReady: "Listo",
    statusApiKeyNotSet: "Clave API no configurada",
    startDictation: "Iniciar Dictado",
    settingsLink: "⚙️ Configuración",
    debugButton: "🐛 Ver Registros de Depuración",
    debugLogsCopied: "Registros copiados al portapapeles y consola (F12)",
    debugLogsInConsole: "Registros de depuración en consola (F12)",
    tips: "Consejos:",
    tipsList: [
      "Haz clic en el botón o presiona {shortcut}",
      "Habla claramente",
      "Presiona Enter/Esc o haz clic para detener",
      "El texto se copia al portapapeles - pega con Ctrl+V"
    ],
    shortcutNotSet: "No configurado",
    shortcutHelpText: "(Configurar en chrome://extensions/shortcuts)",
    
    // Config/Settings
    settingsTitle: "🎤 Configuración de Dictado de Voz con IA",
    apiConfigTitle: "Configuración de API de Groq",
    apiKeyLabel: "Clave API de Groq:",
    apiKeyPlaceholder: "gsk_...",
    apiKeyHelp: "Obtén tu clave API de",
    modelLabel: "Modelo LLM:",
    modelHelp: "Qwen QWQ 32B proporciona la mejor calidad para el procesamiento de texto",
    customModelLabel: "Ruta de Modelo Personalizado:",
    customModelPlaceholder: "ej. meta-llama/tu-modelo-personalizado",
    customModelHelp: "Ingresa la ruta completa del modelo de la lista de modelos de Groq",
    saveButton: "Guardar Configuración",
    saveSuccess: "¡Configuración guardada exitosamente!",
    apiKeyRequired: "Por favor ingresa una clave API",
    apiKeyInvalid: "La clave API debe comenzar con gsk_",
    customModelRequired: "Por favor ingresa una ruta de modelo personalizado",
    systemPromptEmpty: "El prompt del sistema no puede estar vacío",
    
    // Language settings
    languageTitle: "Configuración de Idioma",
    languageLabel: "Idioma de la Interfaz:",
    languageHelp: "Elige tu idioma preferido para la interfaz de la extensión",
    
    // System prompt
    systemPromptTitle: "Personalización del Prompt del Sistema IA",
    systemPromptLabel: "Prompt del Sistema Personalizado:",
    systemPromptPlaceholder: "Ingresa las instrucciones personalizadas del prompt del sistema para la IA...",
    systemPromptHelp: "Personaliza cómo la IA procesa tu texto dictado. El nombre de la aplicación detectada y la URL de la página actual se proporcionarán automáticamente a la IA después de tu prompt personalizado (ej. como 'Current application context: Gmail' y 'Current URL: https://mail.google.com'). Tu prompt debe instruir a la IA sobre cómo usar esta información. El prompt predeterminado proporciona un ejemplo de esto.",
    resetPromptButton: "Restablecer a Predeterminado",
    resetPromptHelp: "Haz clic para restaurar el prompt del sistema predeterminado de la extensión",
    resetPromptSuccess: "Prompt del sistema restablecido a predeterminado",
    
    // Keyboard shortcut
    keyboardShortcutTitle: "Atajo de Teclado",
    currentShortcut: "Atajo actual:",
    shortcutNote: "Nota: Esto coincide con Cmd+Shift+1 en Mac, pero usa Ctrl en Chromebook",
    shortcutChange: "Para cambiar: Ve a chrome://extensions/shortcuts",
    shortcutTip: "💡 Consejo: Mientras grabas, presiona Enter o Esc para detener",
    
    // Sync
    syncTitle: "Sincronización Entre Dispositivos",
    syncDescription: "✅ Esta extensión sincroniza automáticamente la configuración en todos los Chromebooks conectados a tu cuenta de Google.",
    syncInfo: "¡Tu clave API y preferencias estarán disponibles en todos tus dispositivos!",
    
    // How to use
    howToUseTitle: "Cómo Usar",
    howToUseSteps: [
      "Haz clic en el botón o presiona <strong>{shortcut}</strong>",
      "Habla tu mensaje claramente",
      "Presiona <strong>Enter</strong> o <strong>Esc</strong> para detener (o haz clic en el indicador rojo)",
      "Tu texto formateado se copiará al portapapeles",
      "Pega con <strong>Ctrl+V</strong> donde necesites el texto"
    ],
    
    // New features
    newFeaturesTitle: "Nuevas Características:",
    newFeatures: [
      "✨ <strong>Eliminación de muletillas</strong> - \"eh\", \"um\", las duplicaciones se eliminan automáticamente",
      "📝 <strong>Formato inteligente</strong> - El texto se formatea según el contexto",
      "⌨️ <strong>Detención rápida</strong> - Presiona Enter o Esc mientras grabas",
      "🔄 <strong>Auto-sincronización</strong> - La configuración se sincroniza en todos tus Chromebooks"
    ],
    
    // Supported sites
    supportedSitesTitle: "Sitios Compatibles",
    supportedSitesDescription: "La extensión adapta su estilo de escritura para:",
    supportedSitesList: [
      "<strong>Correo</strong> - Gmail: Tono profesional y formal",
      "<strong>Chat</strong> - Slack, Discord: Estilo casual y amigable",
      "<strong>Redes Sociales</strong> - LinkedIn, Twitter/X, Facebook, Reddit: Apropiado para la plataforma",
      "<strong>Documentos</strong> - Google Docs: Escritura bien estructurada",
      "<strong>Notas</strong> - Google Keep, Evernote, OneNote: Claro y organizado",
      "<strong>Código</strong> - GitHub, Colab, Replit, CodePen: Técnico y preciso",
      "<strong>Trabajo</strong> - Jira, Asana, Trello, Notion, Figma: Profesional",
      "<strong>Cualquier otro sitio web</strong> - Escritura estándar y clara"
    ],
    
    // About
    aboutTitle: "Acerca de",
    version: "Versión:",
    model: "Modelo:",
    modelDescription: "Usando el último modelo Qwen QWQ 32B de Groq",
    privacy: "Privacidad:",
    privacyDescription: "Todo el procesamiento, incluida la URL de la página activa para el formato contextual, se realiza a través de llamadas API directas a Groq. La extensión no almacena tu audio de dictado ni las URL completas. Consulta la política de privacidad de Groq para saber cómo manejan los datos de la API.",
    madeWith: "Hecho con ❤️ para todos los usuarios de Chrome",
    
    // Debug
    debugTitle: "Herramientas de Depuración",
    debugHelp: "Haz clic para mostrar los registros de depuración en la consola del navegador para solucionar problemas",
    
    // Content script messages
    recordingIndicator: "Grabando... Presiona Enter/Esc o haz clic para detener",
    recordingTimeRemaining: "Quedan {seconds}s",
    clipboardModeInfo: "Grabando... Tu texto se copiará al portapapeles",
    textCopiedSuccess: "✅ ¡Texto listo! Presiona Ctrl+V para pegar",
    clipboardError: "No se pudo copiar al portapapeles. Texto: {text}",
    extensionError: "Error de extensión: {error}",
    error: "Error: {error}"
  },
  
  fr: {
    // Popup
    extensionTitle: "🎤 Dictée Vocale par IA",
    statusReady: "Prêt",
    statusApiKeyNotSet: "Clé API non définie",
    startDictation: "Démarrer la Dictée",
    settingsLink: "⚙️ Paramètres",
    debugButton: "🐛 Voir les Journaux de Débogage",
    debugLogsCopied: "Journaux copiés dans le presse-papiers et la console (F12)",
    debugLogsInConsole: "Journaux de débogage dans la console (F12)",
    tips: "Conseils :",
    tipsList: [
      "Cliquez sur le bouton ou appuyez sur {shortcut}",
      "Parlez clairement",
      "Appuyez sur Entrée/Échap ou cliquez pour arrêter",
      "Le texte est copié dans le presse-papiers - collez avec Ctrl+V"
    ],
    shortcutNotSet: "Non défini",
    shortcutHelpText: "(Configurer dans chrome://extensions/shortcuts)",
    
    // Config/Settings
    settingsTitle: "🎤 Paramètres de Dictée Vocale par IA",
    apiConfigTitle: "Configuration de l'API Groq",
    apiKeyLabel: "Clé API Groq :",
    apiKeyPlaceholder: "gsk_...",
    apiKeyHelp: "Obtenez votre clé API depuis",
    modelLabel: "Modèle LLM :",
    modelHelp: "Qwen QWQ 32B offre la meilleure qualité pour le traitement du texte",
    customModelLabel: "Chemin du Modèle Personnalisé :",
    customModelPlaceholder: "ex. meta-llama/votre-modèle-personnalisé",
    customModelHelp: "Entrez le chemin complet du modèle depuis la liste des modèles Groq",
    saveButton: "Enregistrer les Paramètres",
    saveSuccess: "Paramètres enregistrés avec succès !",
    apiKeyRequired: "Veuillez entrer une clé API",
    apiKeyInvalid: "La clé API doit commencer par gsk_",
    customModelRequired: "Veuillez entrer un chemin de modèle personnalisé",
    systemPromptEmpty: "L'invite système ne peut pas être vide",
    
    // Language settings
    languageTitle: "Paramètres de Langue",
    languageLabel: "Langue de l'Interface :",
    languageHelp: "Choisissez votre langue préférée pour l'interface de l'extension",
    
    // System prompt
    systemPromptTitle: "Personnalisation de l'Invite Système IA",
    systemPromptLabel: "Invite Système Personnalisée :",
    systemPromptPlaceholder: "Entrez vos instructions d'invite système personnalisées pour l'IA...",
    systemPromptHelp: "Personnalisez la façon dont l'IA traite votre texte dicté. Le nom de l'application détectée et l'URL de la page actuelle seront automatiquement fournis à l'IA après votre invite personnalisée (ex. comme 'Current application context: Gmail' et 'Current URL: https://mail.google.com'). Votre invite doit indiquer à l'IA comment utiliser ces informations. L'invite par défaut fournit un exemple de cela.",
    resetPromptButton: "Réinitialiser par Défaut",
    resetPromptHelp: "Cliquez pour restaurer l'invite système par défaut de l'extension",
    resetPromptSuccess: "Invite système réinitialisée par défaut",
    
    // Keyboard shortcut
    keyboardShortcutTitle: "Raccourci Clavier",
    currentShortcut: "Raccourci actuel :",
    shortcutNote: "Note : Cela correspond à Cmd+Maj+1 sur Mac, mais utilise Ctrl sur Chromebook",
    shortcutChange: "Pour changer : Allez à chrome://extensions/shortcuts",
    shortcutTip: "💡 Astuce : Pendant l'enregistrement, appuyez sur Entrée ou Échap pour arrêter",
    
    // Sync
    syncTitle: "Synchronisation Entre Appareils",
    syncDescription: "✅ Cette extension synchronise automatiquement les paramètres sur tous les Chromebooks connectés à votre compte Google.",
    syncInfo: "Votre clé API et vos préférences seront disponibles sur tous vos appareils !",
    
    // How to use
    howToUseTitle: "Comment Utiliser",
    howToUseSteps: [
      "Cliquez sur le bouton ou appuyez sur <strong>{shortcut}</strong>",
      "Parlez votre message clairement",
      "Appuyez sur <strong>Entrée</strong> ou <strong>Échap</strong> pour arrêter (ou cliquez sur l'indicateur rouge)",
      "Votre texte formaté sera copié dans le presse-papiers",
      "Collez avec <strong>Ctrl+V</strong> où vous avez besoin du texte"
    ],
    
    // New features
    newFeaturesTitle: "Nouvelles Fonctionnalités :",
    newFeatures: [
      "✨ <strong>Suppression des mots de remplissage</strong> - \"euh\", \"um\", les duplications sont automatiquement supprimées",
      "📝 <strong>Formatage intelligent</strong> - Le texte est formaté selon le contexte",
      "⌨️ <strong>Arrêt rapide</strong> - Appuyez sur Entrée ou Échap pendant l'enregistrement",
      "🔄 <strong>Synchronisation automatique</strong> - Les paramètres se synchronisent sur tous vos Chromebooks"
    ],
    
    // Supported sites
    supportedSitesTitle: "Sites Pris en Charge",
    supportedSitesDescription: "L'extension adapte son style d'écriture pour :",
    supportedSitesList: [
      "<strong>Email</strong> - Gmail : Ton professionnel et formel",
      "<strong>Chat</strong> - Slack, Discord : Style décontracté et amical",
      "<strong>Réseaux Sociaux</strong> - LinkedIn, Twitter/X, Facebook, Reddit : Approprié à la plateforme",
      "<strong>Documents</strong> - Google Docs : Écriture bien structurée",
      "<strong>Notes</strong> - Google Keep, Evernote, OneNote : Clair et organisé",
      "<strong>Code</strong> - GitHub, Colab, Replit, CodePen : Technique et précis",
      "<strong>Travail</strong> - Jira, Asana, Trello, Notion, Figma : Professionnel",
      "<strong>Tout autre site web</strong> - Écriture standard et claire"
    ],
    
    // About
    aboutTitle: "À Propos",
    version: "Version :",
    model: "Modèle :",
    modelDescription: "Utilise le dernier modèle Qwen QWQ 32B de Groq",
    privacy: "Confidentialité :",
    privacyDescription: "Tout le traitement, y compris l'URL de la page active pour le formatage contextuel, est effectué via des appels API directs à Groq. L'extension ne stocke pas vos enregistrements audio de dictée ni les URL complètes. Veuillez consulter la politique de confidentialité de Groq pour savoir comment ils gèrent les données API.",
    madeWith: "Fait avec ❤️ pour tous les utilisateurs de Chrome",
    
    // Debug
    debugTitle: "Outils de Débogage",
    debugHelp: "Cliquez pour afficher les journaux de débogage dans la console du navigateur pour le dépannage",
    
    // Content script messages
    recordingIndicator: "Enregistrement... Appuyez sur Entrée/Échap ou cliquez pour arrêter",
    recordingTimeRemaining: "{seconds}s restantes",
    clipboardModeInfo: "Enregistrement... Votre texte sera copié dans le presse-papiers",
    textCopiedSuccess: "✅ Texte prêt ! Appuyez sur Ctrl+V pour coller",
    clipboardError: "Impossible de copier dans le presse-papiers. Texte : {text}",
    extensionError: "Erreur d'extension : {error}",
    error: "Erreur : {error}"
  }
};

// Helper function to get current language
export function getCurrentLanguage() {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.get(['language'], (result) => {
        if (chrome.runtime.lastError) {
          console.error('Error getting language from storage:', chrome.runtime.lastError);
          resolve('en'); // Default to English on error
        } else {
          resolve(result.language || 'en');
        }
      });
    } catch (error) {
      console.error('Error in getCurrentLanguage:', error);
      resolve('en'); // Default to English on error
    }
  });
}

// Helper function to get translation
export async function t(key, replacements = {}) {
  const lang = await getCurrentLanguage();
  let text = translations[lang]?.[key] || translations.en[key] || key;
  
  // Replace placeholders
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
  });
  
  return text;
}