import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center gap-1 px-3 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400 font-mono uppercase cursor-pointer hover:bg-slate-700 transition-colors"
      >
        <Languages className="w-3 h-3" />
        {language.toUpperCase()}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 flex flex-col bg-slate-800 border border-slate-700 rounded shadow-xl overflow-hidden z-50 min-w-[120px]">
          {[
            { code: 'id', label: 'Indonesia' },
            { code: 'en', label: 'English' },
            { code: 'jv', label: 'Jawa' },
            { code: 'ar', label: 'العربية' }
          ].map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code as any);
                setIsOpen(false);
              }}
              className={`text-left px-3 py-2 text-xs font-mono uppercase hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors ${language === lang.code ? 'text-emerald-400 bg-emerald-500/5' : 'text-slate-400'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
