import React, { useState, useRef } from 'react';
import { firebaseStorageService } from '../services/firebaseStorage';
import {
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Star,
  Plus,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface PropertyPhotoUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  propertyId?: string;
}

export const PropertyPhotoUploader: React.FC<PropertyPhotoUploaderProps> = ({
  images,
  onChange,
  propertyId = 'new-listing',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      try {
        const downloadUrl = await firebaseStorageService.uploadPropertyImage(file, propertyId);
        uploadedUrls.push(downloadUrl);
      } catch (err: any) {
        console.warn('Image upload failed, skipping file:', file.name, err);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    } else {
      setUploadError('Failed to upload image(s). Please check format (JPG/PNG) and retry.');
    }
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCover = (indexToCover: number) => {
    if (indexToCover === 0) return;
    const selected = images[indexToCover];
    const remaining = images.filter((_, idx) => idx !== indexToCover);
    onChange([selected, ...remaining]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
          Property Photos &amp; Gallery ({images.length} uploaded)
        </label>
        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
          Firebase Storage Enabled
        </span>
      </div>

      {uploadError && (
        <div className="p-2.5 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-5 rounded-2xl border-2 border-dashed transition text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
          dragOver
            ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30'
            : 'border-stone-300 dark:border-stone-700 hover:border-teal-500 bg-stone-50/60 dark:bg-stone-800/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-7 h-7 text-teal-600 animate-spin" />
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
              Uploading images to Firebase Storage...
            </span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                Click to upload multiple photos, or drag &amp; drop here
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Supports JPG, PNG, WEBP &bull; Max 10MB per image
              </p>
            </div>
          </>
        )}
      </div>

      {/* Or Paste Direct Image URL */}
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste direct image URL (https://...)"
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-3 py-2 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-xl transition flex items-center gap-1 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add URL</span>
        </button>
      </div>

      {/* Thumbnail Gallery Preview */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block">
            Image Gallery Preview (First image is the Primary Cover)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {images.map((imgUrl, idx) => (
              <div
                key={`${imgUrl}-${idx}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-900 shadow-xs"
              >
                <img
                  src={imgUrl}
                  alt={`Listing preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Cover Badge */}
                {idx === 0 ? (
                  <span className="absolute top-1.5 left-1.5 bg-teal-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetCover(idx)}
                    className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition bg-stone-900/80 hover:bg-teal-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                  >
                    Set Cover
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
