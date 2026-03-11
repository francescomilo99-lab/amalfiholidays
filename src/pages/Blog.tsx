import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-24 bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-serif font-bold text-[#003B5C] mb-4 text-center">{t('blog.title')}</h1>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto font-light">
          Storie, consigli e ispirazioni per vivere al meglio la Costiera Amalfitana.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post: any) => (
            <div key={post.id} className="group cursor-pointer">
              <div className="relative h-72 overflow-hidden rounded-2xl mb-6 shadow-sm">
                <img
                  src={post.image_url}
                  alt={i18n.language === 'it' ? post.title_it : post.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-3 uppercase tracking-wider font-medium">
                <Calendar className="w-4 h-4 mr-2 text-[#F2A900]" />
                {new Date(post.created_at).toLocaleDateString(i18n.language === 'it' ? 'it-IT' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4 group-hover:text-[#003B5C] transition-colors">
                {i18n.language === 'it' ? post.title_it : post.title_en}
              </h3>
              <p className="text-gray-600 line-clamp-3 leading-relaxed font-light">
                {i18n.language === 'it' ? post.content_it : post.content_en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
