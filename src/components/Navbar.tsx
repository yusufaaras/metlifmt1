import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { languageNames, type Language } from '@/i18n/translations';

// Dil kodlarına göre emoji bayrakları eşleştirmesi
const languageFlags: Record<string, string> = {
  tr: '🇹🇷',
  en: '🇬🇧',
  de: '🇩🇪',
  fr: '🇫🇷',
  es: '🇪🇸',
  ru: '🇷🇺',
  ar: '🇦🇪',
  // Projenizde başka diller varsa buraya ekleyebilirsiniz
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/products', label: t('nav.products') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Alanı - METLİ & FMT Yan Yana */}
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img
              src="/images/metlilogo.svg"
              alt="Metli Ticaret & FMT Makina"
              className="w-auto h-10 md:h-12 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <div className="flex items-center gap-1.5">
                <span className="text-base md:text-lg font-black tracking-tight text-secondary group-hover:text-primary transition-colors">
                  METLİ
                </span>
                <span className="text-xs md:text-sm font-bold text-gray-300">/</span>
                <span className="text-base md:text-lg font-black tracking-tight text-primary group-hover:text-secondary transition-colors">
                  FMT
                </span>
              </div>
              <div className="hidden xl:block">
                <span className="text-[10px] text-gray-500 font-medium block leading-none">
                  Ticaret & Makina
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(link.to) ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Telli Terbiye — Brown bordered button */}
            <Link
              to="/telli-terbiye"
              className={`ml-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 inline-flex items-center gap-1.5 ${isActive('/telli-terbiye')
                  ? 'bg-secondary text-white shadow-md'
                  : 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white hover:shadow-md'
                }`}
            > 
              {t('nav.telli')}
            </Link>
          </div>

          {/* Lang + Mobile */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-all"
              >
                {/* Seçili olan dilin bayrağı */}
                <span className="text-base select-none">
                  {languageFlags[language.toLowerCase()] || '🌐'}
                </span>
                <span className="hidden sm:inline uppercase">{language}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50"
                  >
                    {(Object.keys(languageNames) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setLanguage(lang); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${language === lang ? 'text-primary bg-primary/10 font-medium' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-base select-none">
                          {languageFlags[lang.toLowerCase()] || '🌐'}
                        </span>
                        <span>{languageNames[lang]}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t border-gray-100 overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.to) ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-primary hover:bg-primary/5'}`}
                >{link.label}</Link>
              ))}
              {/* Telli Terbiye — mobile */}
              <Link to="/telli-terbiye" onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold mt-2 flex items-center gap-2 ${isActive('/telli-terbiye')
                    ? 'bg-secondary text-white'
                    : 'border-2 border-secondary text-secondary'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                {t('nav.telli')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}