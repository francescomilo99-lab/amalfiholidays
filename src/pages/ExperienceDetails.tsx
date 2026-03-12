import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import ImageGallery from '../components/ImageGallery';

export default function ExperienceDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [experience, setExperience] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/experiences/${id}`)
      .then(res => res.json())
      .then(data => setExperience(data));
  }, [id]);

  if (!experience) return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>;

  const title = i18n.language === 'it' ? experience.title_it : experience.title_en;
  const description = i18n.language === 'it' ? experience.description_it : experience.description_en;
  const images = experience.images && experience.images.length > 0 ? experience.images : [experience.image_url];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen pb-24"
    >
      {/* Hero Image */}
      <div className="relative h-[60vh] w-full group overflow-hidden">
        <div 
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((img: string, idx: number) => (
            <div 
              key={idx} 
              className="w-full h-full flex-shrink-0 cursor-pointer"
              onClick={() => setIsGalleryOpen(true)}
            >
              <img
                src={img}
                alt={title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
        
        <button 
          onClick={() => setIsGalleryOpen(true)}
          className="absolute top-6 right-6 md:right-24 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium z-20 border border-white/20 shadow-lg flex items-center hover:bg-black/60 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          Vedi tutte le foto
        </button>

        {images.length > 1 && (
          <>
            <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium z-20 border border-white/20 shadow-lg flex items-center hidden md:flex">
              <span className="mr-1.5 opacity-80">Foto</span> {currentImageIndex + 1} / {images.length}
            </div>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 z-20 border border-white/10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 z-20 border border-white/10">
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {images.map((_: any, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentImageIndex(idx)} 
                  className={`h-2 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`} 
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto pointer-events-auto">
            <Link to="/experiences" className="inline-flex items-center text-white/80 hover:text-white mb-6 uppercase tracking-wider text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alle esperienze
            </Link>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 shadow-sm">{title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#003B5C] mb-6">Descrizione</h2>
              <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
                <p>{description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-[#003B5C] mb-6">Prenota questa esperienza</h3>
              <p className="text-gray-600 mb-8 leading-relaxed font-light">
                Contattaci per maggiori informazioni e per prenotare la tua esperienza: {title}.
              </p>
              
              <a
                href={`https://wa.me/393384828132?text=${encodeURIComponent(`Salve, vorrei maggiori informazioni sull'esperienza: ${title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-[#25D366] text-white py-4 rounded-xl font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition-colors shadow-md mb-4"
              >
                {t('contact.whatsapp')}
              </a>
              
              <a
                href={`mailto:info@amalfiholidays.it?subject=Richiesta info esperienza: ${title}`}
                className="w-full block text-center bg-white border-2 border-[#003B5C] text-[#003B5C] py-4 rounded-xl font-semibold uppercase tracking-wider hover:bg-[#003B5C] hover:text-white transition-colors"
              >
                Invia Email
              </a>
            </div>
          </div>

        </div>
      </div>
      
      <ImageGallery 
        images={images}
        initialIndex={currentImageIndex}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </motion.div>
  );
}
