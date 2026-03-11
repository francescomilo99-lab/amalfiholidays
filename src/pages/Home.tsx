import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import ExperienceCard from '../components/ExperienceCard';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data.slice(0, 3)));
      
    fetch('/api/experiences')
      .then(res => res.json())
      .then(data => setExperiences(data.slice(0, 3)));
      
    fetch('/api/hero_images')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setHeroImages(data.map((item: any) => item.image_url));
        } else {
          setHeroImages(['https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=2070&auto=format&fit=crop']);
        }
      });
  }, []);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black overflow-hidden">
          {heroImages.length > 0 ? heroImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="Amalfi Coast"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                idx === currentImageIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
              }`}
              referrerPolicy="no-referrer"
            />
          )) : (
            <img
              src="https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=2070&auto=format&fit=crop"
              alt="Amalfi Coast"
              className="absolute inset-0 w-full h-full object-cover opacity-100 scale-100 z-10"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />
        </div>
        
        {/* Indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                  idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight leading-tight"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-200 mb-10 font-light tracking-wide"
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              to="/properties"
              className="inline-block bg-[#F2A900] text-[#003B5C] px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wider hover:bg-white transition-colors duration-300 shadow-lg"
            >
              {t('hero.cta')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold text-[#003B5C] mb-8">{t('about.title')}</h2>
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            {t('about.text')}
          </p>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-serif font-bold text-[#003B5C]">{t('properties.title')}</h2>
            <Link to="/properties" className="text-[#F2A900] font-semibold uppercase tracking-wider hover:text-[#003B5C] transition-colors">
              Vedi tutte &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-serif font-bold text-[#003B5C]">{t('experiences.title')}</h2>
            <Link to="/experiences" className="text-[#F2A900] font-semibold uppercase tracking-wider hover:text-[#003B5C] transition-colors">
              Scopri di più &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences.map((experience: any) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
