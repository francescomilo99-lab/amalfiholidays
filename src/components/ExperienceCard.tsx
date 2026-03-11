import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ImageSlider from './ImageSlider';

export interface Experience {
  id: number;
  title_it: string;
  title_en: string;
  description_it: string;
  description_en: string;
  image_url: string;
  images?: string[];
}

const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
  const { i18n } = useTranslation();
  const title = i18n.language === 'it' ? experience.title_it : experience.title_en;
  const description = i18n.language === 'it' ? experience.description_it : experience.description_en;
  const images = experience.images && experience.images.length > 0 ? experience.images : [experience.image_url];

  return (
    <Link to={`/experiences/${experience.id}`} className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[4/5] block">
      <ImageSlider images={images} alt={title} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 pointer-events-none">
        <h3 className="text-3xl font-serif font-bold text-white mb-3 tracking-wide">{title}</h3>
        <p className="text-gray-200 line-clamp-3 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default ExperienceCard;
