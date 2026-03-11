import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropertyCard from '../components/PropertyCard';
import { motion } from 'motion/react';

export default function Properties() {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-24 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-serif font-bold text-[#003B5C] mb-4 text-center">{t('properties.title')}</h1>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto font-light">
          Esplora la nostra selezione di case vacanze e ville di lusso in Costiera Amalfitana.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
