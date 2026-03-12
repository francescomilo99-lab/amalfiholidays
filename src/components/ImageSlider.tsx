import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import ImageGallery from './ImageGallery';

interface ImageSliderProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function ImageSlider({ images, alt, className = '' }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGalleryOpen(true);
  };

  if (!images || images.length === 0) {
    return <div className={`bg-gray-200 ${className}`} />;
  }

  return (
    <>
      <div className={`relative group overflow-hidden ${className}`}>
        <div 
          className="flex h-full w-full transition-transform duration-500 ease-out cursor-pointer"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onClick={openGallery}
        >
          {images.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0">
              <img
                src={img}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
        
        <button
          onClick={openGallery}
          className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white p-1.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 shadow-sm hover:bg-black/70"
          title="Vedi tutte le foto"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {images.length > 1 && (
          <>
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 shadow-sm">
              {currentIndex + 1} / {images.length}
            </div>
            <button 
              onClick={prevImage} 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm z-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}
      </div>

      <ImageGallery
        images={images}
        initialIndex={currentIndex}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </>
  );
}
