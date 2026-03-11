import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import ImageSlider from '../components/ImageSlider';

export default function Restaurants() {
  const { t, i18n } = useTranslation();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-24 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-serif font-bold text-[#003B5C] mb-4 text-center">{t('restaurants.title')}</h1>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto font-light">
          I nostri consigli per assaporare la vera cucina locale, dai ristoranti stellati alle trattorie tradizionali.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {restaurants.map((restaurant: any) => {
            const images = restaurant.images && restaurant.images.length > 0 ? restaurant.images : [restaurant.image_url];
            return (
              <div key={restaurant.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                <div className="relative h-56 overflow-hidden">
                  <ImageSlider images={images} alt={restaurant.name} className="w-full h-full" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#003B5C] flex items-center z-20">
                    <MapPin className="w-3 h-3 mr-1" />
                    {restaurant.location}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 line-clamp-3 leading-relaxed mb-6 flex-grow">
                    {i18n.language === 'it' ? restaurant.description_it : restaurant.description_en}
                  </p>
                  <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="block w-full text-center bg-[#003B5C] text-white py-3 rounded-xl font-medium uppercase tracking-wider text-sm hover:bg-[#002A42] transition-colors"
                  >
                    {t('properties.view_details')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
