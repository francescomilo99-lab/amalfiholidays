import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-24 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-serif font-bold text-[#003B5C] mb-4 text-center">{t('contact.title')}</h1>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto font-light">
          Siamo a tua disposizione per aiutarti a pianificare la tua vacanza da sogno in Costiera Amalfitana.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-serif font-bold text-[#003B5C] mb-8">Informazioni</h2>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-[#003B5C]/5 p-4 rounded-full mr-6">
                  <MapPin className="w-8 h-8 text-[#003B5C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 uppercase tracking-wider">Indirizzo</h3>
                  <p className="text-gray-600 font-light">Via Roma 123<br />84011 Amalfi (SA)<br />Italia</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#003B5C]/5 p-4 rounded-full mr-6">
                  <Phone className="w-8 h-8 text-[#003B5C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 uppercase tracking-wider">Telefono</h3>
                  <p className="text-gray-600 font-light">+39 333 1234567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#003B5C]/5 p-4 rounded-full mr-6">
                  <Mail className="w-8 h-8 text-[#003B5C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 uppercase tracking-wider">Email</h3>
                  <a href="mailto:info@amalfiholidays.com" className="text-[#F2A900] hover:text-[#003B5C] transition-colors font-medium">info@amalfiholidays.com</a>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-12 border-t border-gray-100">
              <h3 className="text-xl font-serif font-bold text-[#003B5C] mb-6">Contattaci Subito</h3>
              <a
                href="https://wa.me/393331234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-[#25D366] text-white py-4 rounded-xl font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition-colors shadow-md"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                {t('contact.whatsapp')}
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-serif font-bold text-[#003B5C] mb-8">Inviaci un Messaggio</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">{t('contact.name')}</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#003B5C] focus:border-transparent transition-shadow bg-gray-50"
                  placeholder="Il tuo nome"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">{t('contact.email')}</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#003B5C] focus:border-transparent transition-shadow bg-gray-50"
                  placeholder="La tua email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">{t('contact.message')}</label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#003B5C] focus:border-transparent transition-shadow bg-gray-50 resize-none"
                  placeholder="Come possiamo aiutarti?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#003B5C] text-white py-4 rounded-xl font-semibold uppercase tracking-wider hover:bg-[#002A42] transition-colors shadow-md"
              >
                {t('contact.send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
