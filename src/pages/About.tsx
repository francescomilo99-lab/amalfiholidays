import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function About() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-24 bg-white min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-serif font-bold text-[#003B5C] mb-8">{t('about.title')}</h1>
        <div className="prose prose-lg mx-auto text-gray-600 font-light leading-relaxed">
          <p className="mb-6">
            {t('about.text')}
          </p>
          <p className="mb-6">
            La nostra missione è offrire un'esperienza autentica e lussuosa, curando ogni dettaglio del vostro soggiorno. Dalla selezione delle migliori proprietà alle esperienze su misura, siamo qui per rendere la vostra vacanza indimenticabile.
          </p>
          <p>
            Affidatevi a noi per scoprire i segreti meglio custoditi della Costiera Amalfitana, vivendo momenti unici tra mare, cultura e gastronomia.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
