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
    
    // Personalization
    personalizationTitle: "Personalization Settings",
    personalizationHelp: "Add your personal information for more accurate dictation corrections. All fields are optional.",
    fullNameLabel: "Full Name:",
    fullNamePlaceholder: "e.g., John Smith",
    fullNameHelp: "Your full name for accurate spelling when dictating",
    businessNameLabel: "Business/Company Name:",
    businessNamePlaceholder: "e.g., Acme Corporation",
    businessNameHelp: "Your company or business name",
    homeAddressLabel: "Home Address:",
    homeAddressPlaceholder: "e.g., 123 Main Street, City, Country",
    homeAddressHelp: "Your home address for accurate formatting",
    workAddressLabel: "Work Address:",
    workAddressPlaceholder: "e.g., 456 Business Ave, City, Country",
    workAddressHelp: "Your work or office address",
    customSpellingsLabel: "Custom Spellings & Terms:",
    customSpellingsPlaceholder: "e.g., MyCompany Ltd, Müller, specialized terms...",
    customSpellingsHelp: "Special names, terms, or spellings that should be preserved exactly (one per line or comma-separated)",
    
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
    modelDescription: "Using Groq's API for text processing",
    privacy: "Privacy:",
    privacyDescription: "All processing, including the URL of the active page for contextual formatting, is done via direct API calls to Groq. The extension does not store your dictation audio or full URLs. Please refer to Groq's privacy policy for how they handle API data.",
    madeWith: "Made with ❤️ for Dad's Chromebook",
    
    // Permission handling
    microphonePermissionRequired: "Microphone permission required for voice dictation",
    grantPermissionButton: "Grant Microphone Access",
    permissionGrantedMessage: "Permission granted! Starting voice dictation...",
    permissionErrorMessage: "Could not access microphone. Please check your system settings.",
    
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
    
    // Personalization
    personalizationTitle: "Personalisierungseinstellungen",
    personalizationHelp: "Fügen Sie Ihre persönlichen Informationen für genauere Diktat-Korrekturen hinzu. Alle Felder sind optional.",
    fullNameLabel: "Vollständiger Name:",
    fullNamePlaceholder: "z.B. Max Mustermann",
    fullNameHelp: "Ihr vollständiger Name für genaue Rechtschreibung beim Diktieren",
    businessNameLabel: "Firmen-/Unternehmensname:",
    businessNamePlaceholder: "z.B. Mustermann GmbH",
    businessNameHelp: "Ihr Firmen- oder Unternehmensname",
    homeAddressLabel: "Privatadresse:",
    homeAddressPlaceholder: "z.B. Musterstraße 123, 12345 Musterstadt",
    homeAddressHelp: "Ihre Privatadresse für genaue Formatierung",
    workAddressLabel: "Arbeitsadresse:",
    workAddressPlaceholder: "z.B. Bürostraße 456, 67890 Arbeitsstadt",
    workAddressHelp: "Ihre Arbeits- oder Büroadresse",
    customSpellingsLabel: "Benutzerdefinierte Schreibweisen & Begriffe:",
    customSpellingsPlaceholder: "z.B. MeineFirma GmbH, Müller, Fachbegriffe...",
    customSpellingsHelp: "Spezielle Namen, Begriffe oder Schreibweisen, die exakt beibehalten werden sollen (eine pro Zeile oder kommagetrennt)",
    
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
    modelDescription: "Verwendet Groqs API für Textverarbeitung",
    privacy: "Datenschutz:",
    privacyDescription: "Die gesamte Verarbeitung, einschließlich der URL der aktiven Seite zur kontextbezogenen Formatierung, erfolgt über direkte API-Aufrufe an Groq. Die Erweiterung speichert weder Ihre Diktat-Audioaufnahmen noch vollständige URLs. Informationen zum Umgang mit API-Daten durch Groq entnehmen Sie bitte deren Datenschutzrichtlinien.",
    madeWith: "Mit ❤️ für Papas Chromebook gemacht",
    
    // Permission handling
    microphonePermissionRequired: "Mikrofon-Berechtigung für Sprachdiktat erforderlich",
    grantPermissionButton: "Mikrofon-Zugriff gewähren",
    permissionGrantedMessage: "Berechtigung erteilt! Starte Sprachdiktat...",
    permissionErrorMessage: "Konnte nicht auf Mikrofon zugreifen. Bitte überprüfen Sie Ihre Systemeinstellungen.",
    
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
    
    // Personalization
    personalizationTitle: "Configuración de Personalización",
    personalizationHelp: "Agrega tu información personal para correcciones de dictado más precisas. Todos los campos son opcionales.",
    fullNameLabel: "Nombre Completo:",
    fullNamePlaceholder: "ej. Juan Pérez",
    fullNameHelp: "Tu nombre completo para ortografía precisa al dictar",
    businessNameLabel: "Nombre de Empresa/Compañía:",
    businessNamePlaceholder: "ej. Empresa S.A.",
    businessNameHelp: "El nombre de tu empresa o compañía",
    homeAddressLabel: "Dirección de Casa:",
    homeAddressPlaceholder: "ej. Calle Principal 123, Ciudad, País",
    homeAddressHelp: "Tu dirección de casa para formato preciso",
    workAddressLabel: "Dirección de Trabajo:",
    workAddressPlaceholder: "ej. Avenida Empresarial 456, Ciudad, País",
    workAddressHelp: "Tu dirección de trabajo u oficina",
    customSpellingsLabel: "Ortografías y Términos Personalizados:",
    customSpellingsPlaceholder: "ej. MiEmpresa S.A., términos especializados...",
    customSpellingsHelp: "Nombres especiales, términos u ortografías que deben preservarse exactamente (uno por línea o separados por comas)",
    
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
    modelDescription: "Usando la API de Groq para procesamiento de texto",
    privacy: "Privacidad:",
    privacyDescription: "Todo el procesamiento, incluida la URL de la página activa para el formato contextual, se realiza a través de llamadas API directas a Groq. La extensión no almacena tu audio de dictado ni las URL completas. Consulta la política de privacidad de Groq para saber cómo manejan los datos de la API.",
    madeWith: "Hecho con ❤️ para todos los usuarios de Chrome",
    
    // Permission handling
    microphonePermissionRequired: "Permiso de micrófono requerido para dictado de voz",
    grantPermissionButton: "Conceder Acceso al Micrófono",
    permissionGrantedMessage: "¡Permiso concedido! Iniciando dictado de voz...",
    permissionErrorMessage: "No se pudo acceder al micrófono. Por favor verifica la configuración de tu sistema.",
    
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
    
    // Personalization
    personalizationTitle: "Paramètres de Personnalisation",
    personalizationHelp: "Ajoutez vos informations personnelles pour des corrections de dictée plus précises. Tous les champs sont optionnels.",
    fullNameLabel: "Nom Complet :",
    fullNamePlaceholder: "ex. Jean Dupont",
    fullNameHelp: "Votre nom complet pour une orthographe précise lors de la dictée",
    businessNameLabel: "Nom d'Entreprise/Société :",
    businessNamePlaceholder: "ex. Entreprise SARL",
    businessNameHelp: "Le nom de votre entreprise ou société",
    homeAddressLabel: "Adresse Domicile :",
    homeAddressPlaceholder: "ex. 123 Rue Principale, Ville, Pays",
    homeAddressHelp: "Votre adresse de domicile pour un formatage précis",
    workAddressLabel: "Adresse Travail :",
    workAddressPlaceholder: "ex. 456 Avenue des Affaires, Ville, Pays",
    workAddressHelp: "Votre adresse de travail ou bureau",
    customSpellingsLabel: "Orthographes et Termes Personnalisés :",
    customSpellingsPlaceholder: "ex. MonEntreprise SARL, termes spécialisés...",
    customSpellingsHelp: "Noms spéciaux, termes ou orthographes qui doivent être préservés exactement (un par ligne ou séparés par des virgules)",
    
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
    modelDescription: "Utilise l'API Groq pour le traitement du texte",
    privacy: "Confidentialité :",
    privacyDescription: "Tout le traitement, y compris l'URL de la page active pour le formatage contextuel, est effectué via des appels API directs à Groq. L'extension ne stocke pas vos enregistrements audio de dictée ni les URL complètes. Veuillez consulter la politique de confidentialité de Groq pour savoir comment ils gèrent les données API.",
    madeWith: "Fait avec ❤️ pour tous les utilisateurs de Chrome",
    
    // Permission handling
    microphonePermissionRequired: "Autorisation du microphone requise pour la dictée vocale",
    grantPermissionButton: "Accorder l'Accès au Microphone",
    permissionGrantedMessage: "Autorisation accordée ! Démarrage de la dictée vocale...",
    permissionErrorMessage: "Impossible d'accéder au microphone. Veuillez vérifier les paramètres de votre système.",
    
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
  },

  it: {
    // Popup
    extensionTitle: "🎤 Dettatura Vocale AI",
    statusReady: "Pronto",
    statusApiKeyNotSet: "Chiave API non impostata",
    startDictation: "Inizia Dettatura",
    settingsLink: "⚙️ Impostazioni",
    debugButton: "🐛 Visualizza Log di Debug",
    debugLogsCopied: "Log copiati negli appunti e console (F12)",
    debugLogsInConsole: "Log di debug nella console (F12)",
    tips: "Suggerimenti:",
    tipsList: [
      "Clicca il pulsante o premi {shortcut}",
      "Parla chiaramente",
      "Premi Invio/Esc o clicca per fermare",
      "Il testo viene copiato negli appunti - incolla con Ctrl+V"
    ],
    shortcutNotSet: "Non impostato",
    shortcutHelpText: "(Imposta in chrome://extensions/shortcuts)",
    
    // Config/Settings
    settingsTitle: "🎤 Impostazioni Dettatura Vocale AI",
    apiConfigTitle: "Configurazione API Groq",
    apiKeyLabel: "Chiave API Groq:",
    apiKeyPlaceholder: "gsk_...",
    apiKeyHelp: "Ottieni la tua chiave API da",
    modelLabel: "Modello LLM:",
    modelHelp: "Qwen QWQ 32B offre la migliore qualità per l'elaborazione del testo",
    customModelLabel: "Percorso Modello Personalizzato:",
    customModelPlaceholder: "es. meta-llama/il-tuo-modello-personalizzato",
    customModelHelp: "Inserisci il percorso completo del modello dall'elenco modelli Groq",
    saveButton: "Salva Impostazioni",
    saveSuccess: "Impostazioni salvate con successo!",
    apiKeyRequired: "Inserisci una chiave API",
    apiKeyInvalid: "La chiave API deve iniziare con gsk_",
    customModelRequired: "Inserisci un percorso modello personalizzato",
    systemPromptEmpty: "Il prompt di sistema non può essere vuoto",
    
    // Language settings
    languageTitle: "Impostazioni Lingua",
    languageLabel: "Lingua Interfaccia:",
    languageHelp: "Scegli la tua lingua preferita per l'interfaccia dell'estensione",
    
    // Personalization
    personalizationTitle: "Impostazioni Personalizzazione",
    personalizationHelp: "Aggiungi le tue informazioni personali per correzioni di dettatura più accurate. Tutti i campi sono opzionali.",
    fullNameLabel: "Nome Completo:",
    fullNamePlaceholder: "es. Mario Rossi",
    fullNameHelp: "Il tuo nome completo per ortografia accurata durante la dettatura",
    businessNameLabel: "Nome Azienda/Società:",
    businessNamePlaceholder: "es. Azienda S.r.l.",
    businessNameHelp: "Il nome della tua azienda o società",
    homeAddressLabel: "Indirizzo di Casa:",
    homeAddressPlaceholder: "es. Via Principale 123, Città, Paese",
    homeAddressHelp: "Il tuo indirizzo di casa per formattazione accurata",
    workAddressLabel: "Indirizzo di Lavoro:",
    workAddressPlaceholder: "es. Viale Business 456, Città, Paese",
    workAddressHelp: "Il tuo indirizzo di lavoro o ufficio",
    customSpellingsLabel: "Ortografie e Termini Personalizzati:",
    customSpellingsPlaceholder: "es. MiaAzienda S.r.l., termini specializzati...",
    customSpellingsHelp: "Nomi speciali, termini o ortografie che devono essere preservati esattamente (uno per riga o separati da virgole)",
    
    // Keyboard shortcut
    keyboardShortcutTitle: "Scorciatoia da Tastiera",
    currentShortcut: "Scorciatoia attuale:",
    shortcutNote: "Nota: Questo corrisponde a Cmd+Shift+1 su Mac, ma usa Ctrl su Chromebook",
    shortcutChange: "Per cambiare: Vai a chrome://extensions/shortcuts",
    shortcutTip: "💡 Suggerimento: Durante la registrazione, premi Invio o Esc per fermare",
    
    // Sync
    syncTitle: "Sincronizzazione tra Dispositivi",
    syncDescription: "✅ Questa estensione sincronizza automaticamente le impostazioni su tutti i Chromebook collegati al tuo account Google.",
    syncInfo: "La tua chiave API e le preferenze saranno disponibili su tutti i tuoi dispositivi!",
    
    // How to use
    howToUseTitle: "Come Usare",
    howToUseSteps: [
      "Clicca il pulsante o premi <strong>{shortcut}</strong>",
      "Pronuncia il tuo messaggio chiaramente",
      "Premi <strong>Invio</strong> o <strong>Esc</strong> per fermare (o clicca l'indicatore rosso)",
      "Il tuo testo formattato sarà copiato negli appunti",
      "Incolla con <strong>Ctrl+V</strong> dove hai bisogno del testo"
    ],
    
    // New features
    newFeaturesTitle: "Nuove Funzionalità:",
    newFeatures: [
      "✨ <strong>Rimozione parole riempitive</strong> - \"ehm\", \"uh\", le duplicazioni vengono rimosse automaticamente",
      "📝 <strong>Formattazione intelligente</strong> - Il testo viene formattato in base al contesto",
      "⌨️ <strong>Arresto rapido</strong> - Premi Invio o Esc durante la registrazione",
      "🔄 <strong>Sincronizzazione automatica</strong> - Le impostazioni si sincronizzano su tutti i tuoi Chromebook"
    ],
    
    // Supported sites
    supportedSitesTitle: "Siti Supportati",
    supportedSitesDescription: "L'estensione adatta il suo stile di scrittura per:",
    supportedSitesList: [
      "<strong>Email</strong> - Gmail: Tono professionale e formale",
      "<strong>Chat</strong> - Slack, Discord: Stile casual e amichevole",
      "<strong>Social</strong> - LinkedIn, Twitter/X, Facebook, Reddit: Appropriato per la piattaforma",
      "<strong>Documenti</strong> - Google Docs: Scrittura ben strutturata",
      "<strong>Note</strong> - Google Keep, Evernote, OneNote: Chiaro e organizzato",
      "<strong>Codice</strong> - GitHub, Colab, Replit, CodePen: Tecnico e preciso",
      "<strong>Lavoro</strong> - Jira, Asana, Trello, Notion, Figma: Professionale",
      "<strong>Qualsiasi altro sito web</strong> - Scrittura standard e chiara"
    ],
    
    // About
    aboutTitle: "Informazioni",
    version: "Versione:",
    model: "Modello:",
    modelDescription: "Utilizza l'API Groq per l'elaborazione del testo",
    privacy: "Privacy:",
    privacyDescription: "Tutta l'elaborazione, incluso l'URL della pagina attiva per la formattazione contestuale, viene eseguita tramite chiamate API dirette a Groq. L'estensione non memorizza i tuoi audio di dettatura né gli URL completi. Consulta la politica sulla privacy di Groq per sapere come gestiscono i dati API.",
    madeWith: "Realizzato con ❤️ per tutti gli utenti di Chrome",
    
    // Permission handling
    microphonePermissionRequired: "Autorizzazione microfono richiesta per la dettatura vocale",
    grantPermissionButton: "Concedi Accesso al Microfono",
    permissionGrantedMessage: "Autorizzazione concessa! Avvio dettatura vocale...",
    permissionErrorMessage: "Impossibile accedere al microfono. Verifica le impostazioni del sistema.",
    
    // Debug
    debugTitle: "Strumenti di Debug",
    debugHelp: "Clicca per visualizzare i log di debug nella console del browser per la risoluzione dei problemi",
    
    // Content script messages
    recordingIndicator: "Registrazione... Premi Invio/Esc o clicca per fermare",
    recordingTimeRemaining: "{seconds}s rimanenti",
    clipboardModeInfo: "Registrazione... Il tuo testo sarà copiato negli appunti",
    textCopiedSuccess: "✅ Testo pronto! Premi Ctrl+V per incollare",
    clipboardError: "Impossibile copiare negli appunti. Testo: {text}",
    extensionError: "Errore estensione: {error}",
    error: "Errore: {error}"
  },

  pt: {
    // Popup
    extensionTitle: "🎤 Ditado de Voz com IA",
    statusReady: "Pronto",
    statusApiKeyNotSet: "Chave API não definida",
    startDictation: "Iniciar Ditado",
    settingsLink: "⚙️ Configurações",
    debugButton: "🐛 Ver Logs de Debug",
    debugLogsCopied: "Logs copiados para área de transferência e console (F12)",
    debugLogsInConsole: "Logs de debug no console (F12)",
    tips: "Dicas:",
    tipsList: [
      "Clique no botão ou pressione {shortcut}",
      "Fale claramente",
      "Pressione Enter/Esc ou clique para parar",
      "O texto é copiado para área de transferência - cole com Ctrl+V"
    ],
    shortcutNotSet: "Não definido",
    shortcutHelpText: "(Configurar em chrome://extensions/shortcuts)",
    
    // Config/Settings
    settingsTitle: "🎤 Configurações de Ditado de Voz com IA",
    apiConfigTitle: "Configuração da API Groq",
    apiKeyLabel: "Chave API Groq:",
    apiKeyPlaceholder: "gsk_...",
    apiKeyHelp: "Obtenha sua chave API em",
    modelLabel: "Modelo LLM:",
    modelHelp: "Qwen QWQ 32B oferece a melhor qualidade para processamento de texto",
    customModelLabel: "Caminho do Modelo Personalizado:",
    customModelPlaceholder: "ex. meta-llama/seu-modelo-personalizado",
    customModelHelp: "Digite o caminho completo do modelo da lista de modelos do Groq",
    saveButton: "Salvar Configurações",
    saveSuccess: "Configurações salvas com sucesso!",
    apiKeyRequired: "Por favor, insira uma chave API",
    apiKeyInvalid: "A chave API deve começar com gsk_",
    customModelRequired: "Por favor, insira um caminho de modelo personalizado",
    systemPromptEmpty: "O prompt do sistema não pode estar vazio",
    
    // Language settings
    languageTitle: "Configurações de Idioma",
    languageLabel: "Idioma da Interface:",
    languageHelp: "Escolha seu idioma preferido para a interface da extensão",
    
    // Personalization
    personalizationTitle: "Configurações de Personalização",
    personalizationHelp: "Adicione suas informações pessoais para correções de ditado mais precisas. Todos os campos são opcionais.",
    fullNameLabel: "Nome Completo:",
    fullNamePlaceholder: "ex. João Silva",
    fullNameHelp: "Seu nome completo para ortografia precisa durante o ditado",
    businessNameLabel: "Nome da Empresa/Companhia:",
    businessNamePlaceholder: "ex. Empresa Ltda.",
    businessNameHelp: "O nome da sua empresa ou companhia",
    homeAddressLabel: "Endereço Residencial:",
    homeAddressPlaceholder: "ex. Rua Principal 123, Cidade, País",
    homeAddressHelp: "Seu endereço residencial para formatação precisa",
    workAddressLabel: "Endereço de Trabalho:",
    workAddressPlaceholder: "ex. Avenida Empresarial 456, Cidade, País",
    workAddressHelp: "Seu endereço de trabalho ou escritório",
    customSpellingsLabel: "Ortografias e Termos Personalizados:",
    customSpellingsPlaceholder: "ex. MinhaEmpresa Ltda., termos especializados...",
    customSpellingsHelp: "Nomes especiais, termos ou ortografias que devem ser preservados exatamente (um por linha ou separados por vírgulas)",
    
    // Keyboard shortcut
    keyboardShortcutTitle: "Atalho de Teclado",
    currentShortcut: "Atalho atual:",
    shortcutNote: "Nota: Isso corresponde a Cmd+Shift+1 no Mac, mas usa Ctrl no Chromebook",
    shortcutChange: "Para alterar: Vá para chrome://extensions/shortcuts",
    shortcutTip: "💡 Dica: Durante a gravação, pressione Enter ou Esc para parar",
    
    // Sync
    syncTitle: "Sincronização entre Dispositivos",
    syncDescription: "✅ Esta extensão sincroniza automaticamente as configurações em todos os Chromebooks conectados à sua conta Google.",
    syncInfo: "Sua chave API e preferências estarão disponíveis em todos os seus dispositivos!",
    
    // How to use
    howToUseTitle: "Como Usar",
    howToUseSteps: [
      "Clique no botão ou pressione <strong>{shortcut}</strong>",
      "Fale sua mensagem claramente",
      "Pressione <strong>Enter</strong> ou <strong>Esc</strong> para parar (ou clique no indicador vermelho)",
      "Seu texto formatado será copiado para a área de transferência",
      "Cole com <strong>Ctrl+V</strong> onde precisar do texto"
    ],
    
    // New features
    newFeaturesTitle: "Novas Funcionalidades:",
    newFeatures: [
      "✨ <strong>Remoção de palavras de preenchimento</strong> - \"ahn\", \"eh\", duplicações são removidas automaticamente",
      "📝 <strong>Formatação inteligente</strong> - O texto é formatado com base no contexto",
      "⌨️ <strong>Parada rápida</strong> - Pressione Enter ou Esc durante a gravação",
      "🔄 <strong>Sincronização automática</strong> - As configurações se sincronizam em todos os seus Chromebooks"
    ],
    
    // Supported sites
    supportedSitesTitle: "Sites Suportados",
    supportedSitesDescription: "A extensão adapta seu estilo de escrita para:",
    supportedSitesList: [
      "<strong>Email</strong> - Gmail: Tom profissional e formal",
      "<strong>Chat</strong> - Slack, Discord: Estilo casual e amigável",
      "<strong>Social</strong> - LinkedIn, Twitter/X, Facebook, Reddit: Apropriado para a plataforma",
      "<strong>Documentos</strong> - Google Docs: Escrita bem estruturada",
      "<strong>Notas</strong> - Google Keep, Evernote, OneNote: Claro e organizado",
      "<strong>Código</strong> - GitHub, Colab, Replit, CodePen: Técnico e preciso",
      "<strong>Trabalho</strong> - Jira, Asana, Trello, Notion, Figma: Profissional",
      "<strong>Qualquer outro site</strong> - Escrita padrão e clara"
    ],
    
    // About
    aboutTitle: "Sobre",
    version: "Versão:",
    model: "Modelo:",
    modelDescription: "Utiliza a API Groq para processamento de texto",
    privacy: "Privacidade:",
    privacyDescription: "Todo o processamento, incluindo a URL da página ativa para formatação contextual, é feito através de chamadas API diretas para o Groq. A extensão não armazena seus áudios de ditado nem URLs completas. Consulte a política de privacidade do Groq para saber como eles lidam com dados da API.",
    madeWith: "Feito com ❤️ para todos os usuários do Chrome",
    
    // Permission handling
    microphonePermissionRequired: "Permissão de microfone necessária para ditado de voz",
    grantPermissionButton: "Conceder Acesso ao Microfone",
    permissionGrantedMessage: "Permissão concedida! Iniciando ditado de voz...",
    permissionErrorMessage: "Não foi possível acessar o microfone. Verifique as configurações do seu sistema.",
    
    // Debug
    debugTitle: "Ferramentas de Debug",
    debugHelp: "Clique para exibir logs de debug no console do navegador para solução de problemas",
    
    // Content script messages
    recordingIndicator: "Gravando... Pressione Enter/Esc ou clique para parar",
    recordingTimeRemaining: "{seconds}s restantes",
    clipboardModeInfo: "Gravando... Seu texto será copiado para a área de transferência",
    textCopiedSuccess: "✅ Texto pronto! Pressione Ctrl+V para colar",
    clipboardError: "Não foi possível copiar para área de transferência. Texto: {text}",
    extensionError: "Erro da extensão: {error}",
    error: "Erro: {error}"
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