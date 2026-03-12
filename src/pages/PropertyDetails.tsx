import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, BedDouble, Bath, MapPin, Check, ArrowLeft, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import ImageGallery from '../components/ImageGallery';

export default function PropertyDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [property, setProperty] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then(data => setProperty(data));
  }, [id]);

  if (!property) return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>;

  const description = i18n.language === 'it' ? property.description_it : property.description_en;
  const images = property.images && property.images.length > 0 ? property.images : [property.image_url];

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
                alt={property.name}
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
            <Link to="/properties" className="inline-flex items-center text-white/80 hover:text-white mb-6 uppercase tracking-wider text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alle proprietà
            </Link>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 shadow-sm">{property.name}</h1>
            <div className="flex items-center text-white/90 text-lg">
              <MapPin className="w-5 h-5 mr-2 text-[#F2A900]" />
              {property.location}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Key Stats */}
            <div className="flex flex-wrap gap-8 py-8 border-y border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-[#003B5C]/5 p-3 rounded-full">
                  <Users className="w-6 h-6 text-[#003B5C]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">{t('properties.guests')}</p>
                  <p className="font-semibold text-xl text-gray-900">{property.guests}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-[#003B5C]/5 p-3 rounded-full">
                  <BedDouble className="w-6 h-6 text-[#003B5C]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">{t('properties.bedrooms')}</p>
                  <p className="font-semibold text-xl text-gray-900">{property.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-[#003B5C]/5 p-3 rounded-full">
                  <Bath className="w-6 h-6 text-[#003B5C]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">{t('properties.bathrooms')}</p>
                  <p className="font-semibold text-xl text-gray-900">{property.bathrooms}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#003B5C] mb-6">Descrizione</h2>
              <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
                <p>{description}</p>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#003B5C] mb-6">Servizi</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 text-gray-700">
                      <Check className="w-5 h-5 text-[#F2A900]" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Map */}
            {(property.map_url || property.location) && (
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#003B5C] mb-6">Posizione</h2>
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 relative">
                  <iframe 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.name + ' ' + property.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mappa della proprietà"
                    className="absolute inset-0"
                  ></iframe>
                </div>
                {property.map_url && (
                  <div className="mt-4">
                    <a 
                      href={property.map_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center px-6 py-3 bg-[#003B5C] text-white rounded-xl hover:bg-[#002A42] transition-colors font-medium shadow-sm"
                    >
                      <MapPin className="w-5 h-5 mr-2" />
                      Apri in Google Maps
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-[#003B5C] mb-6">Prenota questa proprietà</h3>
              <p className="text-gray-600 mb-8 leading-relaxed font-light">
                Contattaci direttamente per verificare la disponibilità e ricevere un preventivo personalizzato per il tuo soggiorno a {property.name}.
              </p>
              
              <a
                href={`https://wa.me/393384828132?text=${encodeURIComponent(`Salve, vorrei richiedere un preventivo per la proprietà: ${property.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-[#25D366] text-white py-4 rounded-xl font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition-colors shadow-md mb-4"
              >
                {t('contact.whatsapp')}
              </a>
              
              <a
                href={`mailto:info@amalfiholidays.it?subject=Richiesta preventivo: ${property.name}`}
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
