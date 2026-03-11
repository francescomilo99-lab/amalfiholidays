import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Save, X, Upload, LogOut, Lock } from 'lucide-react';

export default function Admin() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('properties');
  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setLoginError('');
      } else {
        setLoginError('Password errata');
      }
    } catch (err) {
      setLoginError('Errore di connessione');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      handleLogout();
      throw new Error('Unauthorized');
    }
    return res;
  };

  const fetchData = async (endpoint: string) => {
    try {
      const res = await fetchWithAuth(`/api/${endpoint}`);
      if (!res.ok) {
        throw new Error(`Fetch failed with status ${res.status}`);
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
    setEditingItem(null);
  }, [activeTab]);

  const handleDelete = async (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo elemento?')) {
      try {
        await fetchWithAuth(`/api/${activeTab}/${id}`, { method: 'DELETE' });
        fetchData(activeTab);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up amenities before saving
    const itemToSave = { ...editingItem };
    if (itemToSave.amenities && Array.isArray(itemToSave.amenities)) {
      itemToSave.amenities = itemToSave.amenities.map((a: string) => a.trim()).filter((a: string) => a !== '');
    }

    const method = itemToSave.id ? 'PUT' : 'POST';
    const url = itemToSave.id ? `/api/${activeTab}/${itemToSave.id}` : `/api/${activeTab}`;
    
    try {
      await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToSave),
      });
      
      setEditingItem(null);
      fetchData(activeTab);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingItem((prev: any) => ({ ...prev, [name]: value }));
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        }, 'image/jpeg', 0.8);
      };
      img.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    try {
      const newImages = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        
        // Resize image before uploading to avoid 413 Payload Too Large errors
        const resizedBlob = await resizeImage(file, 1920, 1080);
        
        const formData = new FormData();
        formData.append('image', resizedBlob, file.name);

        const res = await fetchWithAuth('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) {
          const text = await res.text();
          console.error('Upload failed:', res.status, text);
          throw new Error(`Upload failed with status ${res.status}`);
        }
        
        const data = await res.json();
        if (data.url) {
          newImages.push(data.url);
        }
      }

      if (activeTab === 'hero_images' || activeTab === 'blog') {
        setEditingItem((prev: any) => ({ ...prev, image_url: newImages[0] }));
      } else {
        setEditingItem((prev: any) => ({ 
          ...prev, 
          images: [...(prev.images || []), ...newImages] 
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Errore durante il caricamento dell\'immagine');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setEditingItem((prev: any) => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const renderImageUploader = () => {
    const isMulti = ['properties', 'experiences', 'restaurants'].includes(activeTab);
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Immagini</label>
        
        {isMulti ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {(editingItem.images || []).map((img: string, idx: number) => (
              <div key={idx} className="relative group">
                <img src={img} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          editingItem.image_url && (
            <img src={editingItem.image_url} alt="Preview" className="w-full h-48 object-cover rounded-xl mb-2" />
          )
        )}
        
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            multiple={isMulti}
            onChange={handleImageUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className={`w-full p-4 border-2 border-dashed rounded-xl text-center flex flex-col items-center justify-center transition-colors ${isUploading ? 'bg-gray-100 border-gray-300' : 'bg-gray-50 border-gray-300 hover:border-[#003B5C] hover:bg-blue-50'}`}>
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {isUploading ? 'Caricamento in corso...' : (isMulti ? 'Clicca o trascina più immagini qui' : 'Clicca o trascina un\'immagine qui')}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (!editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif font-bold text-[#003B5C]">
              {editingItem.id ? t('admin.edit') : t('admin.add')}
            </h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Dynamic fields based on activeTab */}
            {activeTab === 'properties' && (
              <>
                <input name="name" value={editingItem.name || ''} onChange={handleChange} placeholder="Nome" className="w-full p-3 border rounded-xl" required />
                <textarea name="description_it" value={editingItem.description_it || ''} onChange={handleChange} placeholder="Descrizione IT" className="w-full p-3 border rounded-xl" required />
                <textarea name="description_en" value={editingItem.description_en || ''} onChange={handleChange} placeholder="Descrizione EN" className="w-full p-3 border rounded-xl" required />
                <div className="grid grid-cols-3 gap-4">
                  <input type="number" name="guests" value={editingItem.guests || ''} onChange={handleChange} placeholder="Ospiti" className="w-full p-3 border rounded-xl" required />
                  <input type="number" name="bedrooms" value={editingItem.bedrooms || ''} onChange={handleChange} placeholder="Camere" className="w-full p-3 border rounded-xl" required />
                  <input type="number" name="bathrooms" value={editingItem.bathrooms || ''} onChange={handleChange} placeholder="Bagni" className="w-full p-3 border rounded-xl" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="location" value={editingItem.location || ''} onChange={handleChange} placeholder="Località" className="w-full p-3 border rounded-xl" required />
                  <input name="map_url" value={editingItem.map_url || ''} onChange={handleChange} placeholder="Link Google Maps (es. https://goo.gl/maps/...)" className="w-full p-3 border rounded-xl" />
                </div>
                <input 
                  name="amenities" 
                  value={Array.isArray(editingItem.amenities) ? editingItem.amenities.join(', ') : (editingItem.amenities || '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    const arr = val.split(',').map(s => s.trimStart());
                    setEditingItem((prev: any) => ({ ...prev, amenities: arr }));
                  }}
                  placeholder="Servizi (separati da virgola: WiFi, Piscina, Aria Condizionata)" 
                  className="w-full p-3 border rounded-xl" 
                />
                {renderImageUploader()}
              </>
            )}
            
            {(activeTab === 'experiences' || activeTab === 'blog') && (
              <>
                <input name="title_it" value={editingItem.title_it || ''} onChange={handleChange} placeholder="Titolo IT" className="w-full p-3 border rounded-xl" required />
                <input name="title_en" value={editingItem.title_en || ''} onChange={handleChange} placeholder="Titolo EN" className="w-full p-3 border rounded-xl" required />
                <textarea name={activeTab === 'blog' ? 'content_it' : 'description_it'} value={editingItem.content_it || editingItem.description_it || ''} onChange={handleChange} placeholder="Contenuto IT" className="w-full p-3 border rounded-xl h-32" required />
                <textarea name={activeTab === 'blog' ? 'content_en' : 'description_en'} value={editingItem.content_en || editingItem.description_en || ''} onChange={handleChange} placeholder="Contenuto EN" className="w-full p-3 border rounded-xl h-32" required />
                {renderImageUploader()}
              </>
            )}

            {activeTab === 'restaurants' && (
              <>
                <input name="name" value={editingItem.name || ''} onChange={handleChange} placeholder="Nome" className="w-full p-3 border rounded-xl" required />
                <textarea name="description_it" value={editingItem.description_it || ''} onChange={handleChange} placeholder="Descrizione IT" className="w-full p-3 border rounded-xl" required />
                <textarea name="description_en" value={editingItem.description_en || ''} onChange={handleChange} placeholder="Descrizione EN" className="w-full p-3 border rounded-xl" required />
                <input name="location" value={editingItem.location || ''} onChange={handleChange} placeholder="Località" className="w-full p-3 border rounded-xl" required />
                {renderImageUploader()}
              </>
            )}

            {activeTab === 'hero_images' && (
              <>
                <input type="number" name="display_order" value={editingItem.display_order || 0} onChange={handleChange} placeholder="Ordine di visualizzazione (es. 1, 2, 3)" className="w-full p-3 border rounded-xl" required />
                {renderImageUploader()}
              </>
            )}

            <div className="flex justify-end space-x-4 mt-8">
              <button type="button" onClick={() => setEditingItem(null)} className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">
                {t('admin.cancel')}
              </button>
              <button type="submit" className="px-6 py-3 bg-[#003B5C] text-white rounded-xl hover:bg-[#002A42] flex items-center font-medium" disabled={isUploading}>
                <Save className="w-5 h-5 mr-2" />
                {t('admin.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 w-full max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#003B5C]">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-center text-[#003B5C] mb-8">Accesso Area Admin</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003B5C] focus:border-transparent outline-none transition-all"
                placeholder="Inserisci la password"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button 
              type="submit"
              className="w-full py-4 bg-[#003B5C] text-white rounded-xl font-medium hover:bg-[#002A42] transition-colors"
            >
              Accedi
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#003B5C]">{t('admin.title')}</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Esci
          </button>
        </div>
        
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-4">
          {['properties', 'experiences', 'restaurants', 'blog', 'hero_images'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeTab === tab ? 'bg-[#003B5C] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab === 'hero_images' ? 'Immagini Home' : t(`admin.${tab}`)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 capitalize">{t(`admin.${activeTab}`)}</h2>
            <button
              onClick={() => setEditingItem({})}
              className="bg-[#F2A900] text-[#003B5C] px-6 py-3 rounded-xl flex items-center font-semibold hover:bg-[#e5a000] transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('admin.add')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-4 px-4 font-semibold text-gray-600 uppercase tracking-wider text-sm">ID</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 uppercase tracking-wider text-sm">Nome / Titolo</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 uppercase tracking-wider text-sm text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-500">#{item.id}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {activeTab === 'hero_images' ? (
                        <div className="flex items-center space-x-4">
                          <img src={item.image_url} alt="Hero" className="w-16 h-16 object-cover rounded-lg" />
                          <span>Ordine: {item.display_order}</span>
                        </div>
                      ) : (
                        item.name || item.title_it
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors mr-2">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">Nessun elemento trovato.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {renderForm()}
    </motion.div>
  );
}
