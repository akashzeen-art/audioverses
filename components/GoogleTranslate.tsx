"use client";

import { useEffect, useState, useRef } from "react";
import { Languages, ChevronDown, Globe, CheckCircle } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "fr", name: "Français", flag: "🇫🇷", nativeName: "Français" },
  { code: "ar", name: "العربية", flag: "🇸🇦", nativeName: "العربية" },
];

const setTranslationCookies = (targetLanguage: string | null) => {
  const domain = window.location.hostname;
  const cookieValue = targetLanguage ? `/en/${targetLanguage}` : "";

  const cookieBase = `path=/;${domain ? `domain=${domain};` : ""}`;
  const expiration = targetLanguage ? "" : "expires=Thu, 01 Jan 1970 00:00:00 GMT;";

  document.cookie = `googtrans=${cookieValue};${cookieBase}${expiration}`;
  document.cookie = `googtrans=${cookieValue};path=/;${expiration}`;
  document.cookie = `googtrans=/auto/${targetLanguage ?? "en"};${cookieBase}${expiration}`;
};

const getCurrentLanguageFromCookies = () => {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=([^;]+)/);
  if (match && match[1]) {
    const parts = decodeURIComponent(match[1]).split("/");
    const lang = parts[parts.length - 1];
    if (languages.some((language) => language.code === lang)) {
      return lang;
    }
  }
  return "en";
};

export default function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGoogleTranslateLoaded, setIsGoogleTranslateLoaded] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize Google Translate when component mounts
  useEffect(() => {
    // Wait for the page to load completely
    const timer = setTimeout(() => {
      initializeGoogleTranslate();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const initializeGoogleTranslate = () => {
    try {
      const win = window as any;
      // Check if Google Translate is already available
      if (win.google && win.google.translate) {
        console.log("Google Translate already available");
        setIsGoogleTranslateLoaded(true);
        return;
      }

      // Create the callback function
      win.googleTranslateElementInit = () => {
        console.log("Google Translate callback triggered");
        try {
          new win.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              autoDisplay: false,
              includedLanguages: languages.map(lang => lang.code).join(","),
              layout: win.google.translate.TranslateElement.InlineLayout.SIMPLE,
              gaTrack: false,
              multilanguagePage: true,
            },
            "google_translate_element"
          );
          console.log("Google Translate initialized successfully");
          setIsGoogleTranslateLoaded(true);
        } catch (err) {
          console.error("Google Translate initialization error:", err);
          setTranslationError("Failed to initialize translator");
        }
      };

      // Load Google Translate script
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => {
        console.error("Failed to load Google Translate script");
        setTranslationError("Failed to load translator");
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error("Error initializing Google Translate:", error);
      setTranslationError("Failed to initialize translator");
    }
  };

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === selectedLanguage) {
      setIsOpen(false);
      return;
    }

    setSelectedLanguage(languageCode);
    setIsOpen(false);
    setIsTranslating(true);
    setTranslationError(null);

    try {
      if (languageCode === "en") {
        setTranslationCookies(null);
      } else {
        setTranslationCookies(languageCode);
      }

      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslationError("Translation failed");
      setIsTranslating(false);
    }
  };

  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.code === selectedLanguage) || languages[0];
  };

  // Check current translation state and update selected language
  useEffect(() => {
    const checkCurrentTranslation = () => {
      const cookieLang = getCurrentLanguageFromCookies();
      if (cookieLang !== selectedLanguage) {
        setSelectedLanguage(cookieLang);
      }
    };

    // Check immediately and then periodically
    checkCurrentTranslation();
    const interval = setInterval(checkCurrentTranslation, 1000);
    
    return () => clearInterval(interval);
  }, [selectedLanguage]);

  // Hide Google Translate banner and handle translation state
  useEffect(() => {
    const hideBanner = () => {
      const banner = document.querySelector(".goog-te-banner-frame") as HTMLElement;
      const iframe = document.querySelector("iframe.skiptranslate") as HTMLElement;
      const skipLink = document.querySelector(".skiptranslate") as HTMLElement;
      
      if (banner) banner.style.display = "none";
      if (iframe) iframe.style.display = "none";
      if (skipLink) skipLink.style.display = "none";
      
      document.body.style.top = "0px";
    };

    const interval = setInterval(hideBanner, 100);
    return () => clearInterval(interval);
  }, []);

  // Reset to English
  const resetToEnglish = () => {
    setSelectedLanguage("en");
    setIsTranslating(true);
    
    // Remove translation parameters from URL
    setTranslationCookies(null);
    window.location.reload();
  };

  if (translationError) {
    return (
      <div className="relative">
        <button
          onClick={() => setTranslationError(null)}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg border border-red-500/30"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs">Error</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden" />
      
      {/* Custom Language Selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#3A3A55]/50 hover:bg-[#3A3A55]/70 text-[#EAEAEA] px-3 py-2 rounded-lg transition-all duration-300 border border-[#3A3A55] hover:border-[#FFD369]/50"
        disabled={isTranslating}
      >
        <Languages className="h-4 w-4 text-[#FFD369]" />
        <span className="text-sm font-medium">{getCurrentLanguage().flag}</span>
        <span className="text-xs text-[#EAEAEA]/70 hidden sm:inline">
          {getCurrentLanguage().name}
        </span>
        <ChevronDown className={`h-3 w-3 text-[#EAEAEA]/70 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-[#3A3A55]/95 backdrop-blur-md rounded-lg shadow-xl border border-[#3A3A55] z-[9999]">
          <div className="p-2">
            {/* Header */}
            <div className="px-3 py-2 border-b border-[#3A3A55] mb-2">
              <div className="flex items-center gap-2 text-[#EAEAEA]/70 text-sm">
                <Globe className="h-3 w-3" />
                Select Language
              </div>
            </div>
            
            {/* Language Options */}
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#FFD369]/10 transition-colors duration-200 rounded ${
                  selectedLanguage === language.code 
                    ? "bg-[#FFD369]/20 text-[#FFD369]" 
                    : "text-[#EAEAEA] hover:text-[#FFD369]"
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{language.name}</div>
                  <div className="text-xs text-[#EAEAEA]/60">{language.nativeName}</div>
                </div>
                {selectedLanguage === language.code && (
                  <CheckCircle className="h-4 w-4 text-[#FFD369]" />
                )}
              </button>
            ))}
            
            {/* Reset to English */}
            {selectedLanguage !== "en" && (
              <div className="pt-2 border-t border-[#3A3A55]">
                <button
                  onClick={resetToEnglish}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#EAEAEA]/70 hover:text-[#FFD369] hover:bg-[#FFD369]/10 transition-colors duration-200 rounded"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Reset to English</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isTranslating && (
        <div className="absolute -bottom-8 left-0 text-xs text-[#FFD369] animate-pulse bg-[#3A3A55]/80 px-2 py-1 rounded">
          Translating...
        </div>
      )}

      {/* Status indicator */}
      {!isGoogleTranslateLoaded && !translationError && (
        <div className="absolute -bottom-8 left-0 text-xs text-[#EAEAEA]/50 bg-[#3A3A55]/80 px-2 py-1 rounded">
          Loading translator...
        </div>
      )}
    </div>
  );
}
