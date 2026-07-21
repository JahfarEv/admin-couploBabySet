// utils/cloudinary.ts
interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResponse> {
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  console.log('Cloudinary debug:', {
    cloudName,
    uploadPreset,
    url,
  });

  if (!uploadPreset || uploadPreset === 'your_upload_preset') {
    throw new Error(
      'Cloudinary upload preset is not configured. Set VITE_CLOUDINARY_UPLOAD_PRESET in .env to an unsigned upload preset.'
    );
  }

  if (!cloudName) {
    throw new Error(
      'Cloudinary cloud name is not configured. Set VITE_CLOUDINARY_CLOUD_NAME in .env.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export function getCloudinaryImageUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const transformations = options ? 
    `c_${options.crop || 'fill'},w_${options.width || 300},h_${options.height || 300},q_${options.quality || 'auto'}` 
    : '';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}