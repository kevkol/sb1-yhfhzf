import React, { useContext } from 'react';
import { Menu, Globe, User } from 'lucide-react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { language, setLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'da' : 'en');
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{t('dashboard.title')}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Globe className="w-4 h-4" />
            <span>{language.toUpperCase()}</span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
