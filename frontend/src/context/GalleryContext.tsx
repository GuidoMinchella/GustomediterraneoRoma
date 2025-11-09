import React, { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface GalleryPhoto {
  id: string;
  public_id: string;
  url: string;
  created_at: string;
}

interface GalleryContextType {
  photos: GalleryPhoto[];
  loading: boolean;
  error: string | null;
  fetchPhotos: () => Promise<void>;
  addPhoto: (photo: Omit<GalleryPhoto, 'id' | 'created_at'>) => Promise<void>;
  deletePhoto: (public_id: string) => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useGallery = () => {
  const ctx = useContext(GalleryContext);
  if (!ctx) throw new Error('useGallery must be used within a GalleryProvider');
  return ctx;
};

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeSample = useCallback(async () => {
    setPhotos([]);
  }, []);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase gallery_photos error:', error.message);
        await initializeSample();
        return;
      }
      setPhotos((data || []) as GalleryPhoto[]);
    } catch (err) {
      console.error('fetchPhotos error:', err);
      setError('Errore nel caricamento delle foto galleria');
      await initializeSample();
    } finally {
      setLoading(false);
    }
  }, [initializeSample]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const addPhoto = useCallback(async (photo: Omit<GalleryPhoto, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('gallery_photos')
      .insert([{ public_id: photo.public_id, url: photo.url }])
      .select()
      .single();
    if (error) throw error;
    setPhotos(prev => [data as GalleryPhoto, ...prev]);
  }, []);

  const deletePhoto = useCallback(async (public_id: string) => {
    const { error } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('public_id', public_id);
    if (error) throw error;
    setPhotos(prev => prev.filter(p => p.public_id !== public_id));
  }, []);

  const value: GalleryContextType = {
    photos,
    loading,
    error,
    fetchPhotos,
    addPhoto,
    deletePhoto,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};
