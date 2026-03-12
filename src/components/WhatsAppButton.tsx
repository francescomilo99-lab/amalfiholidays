import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WhatsAppButton() {
  const { t } = useTranslation();
  
  // Replace with actual WhatsApp number
  const phoneNumber = "393384828132";
  const message = "Salve, vorrei avere maggiori informazioni sulle vostre proprietà e servizi.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors duration-300 flex items-center justify-center group"
      aria-label={t('contact.whatsapp')}
    >
      <MessageCircle className="w-8 h-8" />
      <span className="absolute right-full mr-4 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {t('contact.whatsapp')}
      </span>
    </a>
  );
}
