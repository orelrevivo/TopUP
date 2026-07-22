import { useStore } from '@nanostores/react';
import { languageStore } from '../stores/language';
import { translations } from './translations';

export function useTranslation() {
  const currentLanguage = useStore(languageStore);

  const t = (key: string): string => {
    // Get the dictionary for the current language, fallback to English
    const dict = translations[currentLanguage] || translations.en;
    
    // Return the translated key, fallback to English dictionary, then fallback to the key itself
    return dict[key] || translations.en[key] || key;
  };

  return { t, currentLanguage };
}
