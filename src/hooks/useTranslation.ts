import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';

type TranslationKey = keyof typeof translations['en'];
type NestedTranslationKey = `${TranslationKey}.${string}`;

type TranslationValue = string | { [key: string]: TranslationValue };

export function useTranslation() {
  const { language } = useContext(LanguageContext);

  const t = (key: NestedTranslationKey): string => {
    const keys = key.split('.');
    let current: TranslationValue = translations[language];

    for (const k of keys) {
      if (typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
        return key;
      }
    }

    return typeof current === 'string' ? current : key;
  };

  return { t };
}
