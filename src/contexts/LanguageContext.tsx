import React, { createContext, useState, useCallback } from 'react';

interface LanguageContextType {
  language: 'en' | 'da';
  setLanguage: (lang: 'en' | 'da') => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'da'>('en');
  
  const handleSetLanguage = useCallback((lang: 'en' | 'da') => {
    setLanguage(lang);
  }, []);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}