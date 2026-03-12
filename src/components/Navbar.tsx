import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Instagram } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'it' ? 'en' : 'it');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.properties'), path: '/properties' },
    { name: t('nav.experiences'), path: '/experiences' },
    { name: t('nav.restaurants'), path: '/restaurants' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-3">
              <img src="/logo.png?v=20260312" alt="Amalfi Holidays Logo" className="h-12 w-auto" />
              <span className="text-2xl font-serif text-[#003B5C] font-bold tracking-wider">Amalfi Holidays</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-[#F2A900] transition-colors duration-200 text-sm font-medium uppercase tracking-wider"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/amalfi_holidays/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-[#E1306C] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <button
              onClick={toggleLanguage}
              className="flex items-center text-gray-700 hover:text-[#003B5C] transition-colors"
            >
              <Globe className="w-5 h-5 mr-1" />
              <span className="uppercase text-sm font-medium">{i18n.language}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#003B5C] focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#F2A900] hover:bg-gray-50 uppercase tracking-wider"
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-[#003B5C] hover:bg-gray-50 uppercase tracking-wider"
            >
              <Globe className="w-5 h-5 mr-2" />
              {i18n.language === 'it' ? 'English' : 'Italiano'}
            </button>
            <a
              href="https://www.instagram.com/amalfi_holidays/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-[#E1306C] hover:bg-gray-50 uppercase tracking-wider"
              onClick={() => setIsOpen(false)}
            >
              <Instagram className="w-5 h-5 mr-2" />
              Instagram
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
