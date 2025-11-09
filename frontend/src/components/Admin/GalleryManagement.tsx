import React, { useState } from 'react';
import { useGallery } from '../../context/GalleryContext';
import { Plus, X, Upload } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || 'folder';

const GalleryManagement: React.FC = () => {
  const { photos, addPhoto, deletePhoto, loading, error } = useGallery();
  const [adding, setAdding] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const openAdder = () => setAdding(true);
  const closeAdder = () => { setAdding(false); setSelectedFile(null); setPreview(null); };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert('Configurazione Cloudinary mancante. Imposta VITE_CLOUDINARY_CLOUD_NAME e VITE_CLOUDINARY_UPLOAD_PRESET');
      return;
    }
    try {
      setUploading(true);
      const unique = (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function')
        ? (crypto as any).randomUUID()
        : String(Date.now());
      const fileBaseId = `gallery-${unique}`;
      const fd = new FormData();
      fd.append('file', selectedFile);
      fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET as string);
      fd.append('folder', CLOUDINARY_FOLDER);
      fd.append('public_id', fileBaseId);
      fd.append('tags', 'gallery');
      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
      const resp = await fetch(url, { method: 'POST', body: fd });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json?.error?.message || 'Upload fallito');
      const secureUrl: string = String(json.secure_url || json.url || '');
      const publicId: string = String(json.public_id || fileBaseId);
      await addPhoto({ public_id: publicId, url: secureUrl });
      closeAdder();
    } catch (err: any) {
      console.error('Errore upload Cloudinary:', err);
      alert(`Errore nel caricamento: ${err?.message || 'verifica preset e cloud name'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (public_id: string) => {
    if (!confirm('Eliminare la foto dalla galleria e da Cloudinary?')) return;
    try {
      // Prima rimuovi da Cloudinary (server-side)
      const resp = await fetch('/api/cloudinary-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id }),
      });
      // Tenta di leggere JSON solo se presente, altrimenti gestisci testo o body vuoto
      const contentType = resp.headers.get('content-type') || '';
      let parsed: any = null;
      if (contentType.includes('application/json')) {
        parsed = await resp.json().catch(() => null);
      } else {
        const text = await resp.text();
        if (text) {
          try { parsed = JSON.parse(text); } catch { parsed = { message: text }; }
        }
      }
      if (!resp.ok) {
        const msg = parsed?.error || parsed?.message || resp.statusText || 'Eliminazione Cloudinary fallita';
        throw new Error(msg);
      }
      // Poi rimuovi dalla tabella supabase
      await deletePhoto(public_id);
    } catch (err: any) {
      console.error('Errore eliminazione:', err);
      alert(`Errore nell'eliminazione: ${err?.message || 'riprovare'}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Gestione Galleria</h2>
        <button
          onClick={openAdder}
          className="flex items-center px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Aggiungi Foto
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-600">{error}</div>
      )}

      {adding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Nuova Foto</h3>
              <button onClick={closeAdder} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Placeholder stile aggiunta piatti */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Immagine</label>
                <div className={`relative flex flex-col items-center justify-center w-full border-2 rounded-md p-6 transition-colors border-dashed border-gray-300 bg-gray-50`}>
                  {preview ? (
                    <img src={preview} alt="Anteprima" className="w-full h-40 object-cover rounded" />
                  ) : (
                    <div className="text-center text-gray-600">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                      <p className="text-sm">Trascina qui una foto</p>
                      <p className="text-xs text-gray-500 mt-1">Oppure usa il pulsante qui sotto</p>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    <input id="gallery-image-input" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                    <label htmlFor="gallery-image-input" className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                      Seleziona immagine
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeAdder}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Annulla
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className={`px-4 py-2 rounded-md ${uploading ? 'bg-gray-300 text-gray-500' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
                >
                  {uploading ? 'Caricamento...' : 'Aggiungi a galleria'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {photos.map((p) => (
          <div key={p.public_id} className="relative border rounded-md bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => handleDelete(p.public_id)}
              className="absolute top-1 right-1 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow"
              title="Elimina"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={p.url} alt={p.public_id} className="w-full h-32 object-cover" />
            <div className="p-2 text-xs text-gray-600 truncate">{p.public_id}</div>
          </div>
        ))}
        {loading && (
          <div className="col-span-full text-center text-gray-600">Caricamento galleria...</div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;
