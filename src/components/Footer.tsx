import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#003B5C] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <img src="/logo.png?v=20260312" alt="Amalfi Holidays" className="h-24 w-auto mb-6" />
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
              {t('about.text')}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/amalfi_holidays/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#F2A900] transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider text-[#F2A900]">Esplora</h3>
            <ul className="space-y-4">
              <li><Link to="/properties" className="text-gray-300 hover:text-white transition-colors">{t('nav.properties')}</Link></li>
              <li><Link to="/experiences" className="text-gray-300 hover:text-white transition-colors">{t('nav.experiences')}</Link></li>
              <li><Link to="/restaurants" className="text-gray-300 hover:text-white transition-colors">{t('nav.restaurants')}</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">{t('nav.blog')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider text-[#F2A900]">Contatti</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-[#F2A900] flex-shrink-0 mt-1" />
                <span className="text-gray-300">Via Giovanni Augustariccio 50, Amalfi (SA), Italia</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-[#F2A900]" />
                <span className="text-gray-300">+39 338 482 8132</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-[#F2A900]" />
                <a href="mailto:info@amalfiholidays.it" className="text-gray-300 hover:text-white transition-colors">info@amalfiholidays.it</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Amalfi Holidays. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
