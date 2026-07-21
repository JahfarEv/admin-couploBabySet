// components/ui/ImageUpload.tsx
import { useEffect, useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '@/utils/cloudinary';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
  disabled?: boolean;
  onUploadStateChange?: (isUploading: boolean) => void;
}

export function ImageUpload({ 
  onImageUpload, 
  currentImage, 
  className = '',
  disabled = false,
  onUploadStateChange
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentImage || '');
  }, [currentImage]);

  useEffect(() => {
    onUploadStateChange?.(isUploading);
  }, [isUploading, onUploadStateChange]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Show local preview while uploading
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file);
      
      // Update with Cloudinary URL
      setPreviewUrl(result.secure_url);
      onImageUpload(result.secure_url);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      // Revert preview on error
      if (previewUrl && !previewUrl.startsWith('data:') && !previewUrl.startsWith('http://localhost')) {
        // Keep existing image if any
      } else {
        setPreviewUrl(currentImage || '');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Product preview"
              className="h-20 w-20 rounded-lg object-cover border border-black/10"
            />
            {!isUploading && !disabled && (
              <button
                onClick={handleRemoveImage}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                type="button"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-black/20 bg-cream-soft">
            <Upload size={24} className="text-ink-faint" />
          </div>
        )}
        
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading || disabled}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-black/5 ${
              (isUploading || disabled) ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </span>
            ) : (
              'Upload Image'
            )}
          </label>
          <p className="mt-1 text-xs text-ink-muted">
            PNG, JPG or WEBP up to 5MB
          </p>
          {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}