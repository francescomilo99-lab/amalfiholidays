import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, BedDouble, Bath, MapPin } from 'lucide-react';
import ImageSlider from './ImageSlider';

export interface Property {
  id: number;
  name: string;
  description_it: string;
  description_en: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  image_url: string;
  images?: string[];
}

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  const { t, i18n } = useTranslation();
  const description = i18n.language === 'it' ? property.description_it : property.description_en;
  const images = property.images && property.images.length > 0 ? property.images : [property.image_url];

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 group">
      <div className="relative h-64 overflow-hidden">
        <ImageSlider images={images} alt={property.name} className="w-full h-full" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#003B5C] flex items-center z-20">
          <MapPin className="w-3 h-3 mr-1" />
          {property.location}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{property.name}</h3>
        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed flex-grow">
          {description}
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-100">
          <div className="flex flex-col items-center text-center">
            <Users className="w-5 h-5 text-[#F2A900] mb-1" />
            <span className="text-sm font-medium text-gray-700">{property.guests} {t('properties.guests')}</span>
          </div>
          <div className="flex flex-col items-center text-center border-l border-gray-100">
            <BedDouble className="w-5 h-5 text-[#F2A900] mb-1" />
            <span className="text-sm font-medium text-gray-700">{property.bedrooms} {t('properties.bedrooms')}</span>
          </div>
          <div className="flex flex-col items-center text-center border-l border-gray-100">
            <Bath className="w-5 h-5 text-[#F2A900] mb-1" />
            <span className="text-sm font-medium text-gray-700">{property.bathrooms} {t('properties.bathrooms')}</span>
          </div>
        </div>

        <Link
          to={`/properties/${property.id}`}
          className="block w-full text-center bg-[#003B5C] text-white py-3 rounded-xl font-medium uppercase tracking-wider text-sm hover:bg-[#002A42] transition-colors"
        >
          {t('properties.view_details')}
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
