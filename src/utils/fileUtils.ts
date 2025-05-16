
/**
 * File utilities for image processing and uploads
 */
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Create a thumbnail from an image file
 * @param file - Image file to process
 * @param maxWidth - Maximum width of the thumbnail
 * @returns Blob of the thumbnail
 */
export const createThumbnail = async (file: File, maxWidth = 300): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create thumbnail'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Upload a motorcycle image and create a thumbnail
 */
export const uploadMotorcycleImage = async (
  userId: string,
  file: File
): Promise<{ imageUrl: string; thumbnailUrl: string }> => {
  try {
    // Create unique file paths
    const timestamp = new Date().getTime();
    const imagePathBase = `${userId}/${timestamp}`;
    const imagePath = `${imagePathBase}.${file.name.split('.').pop()}`;
    const thumbnailPath = `${imagePathBase}_thumb.jpg`;

    // Upload original image
    const { error: uploadError, data: imageData } = await supabase.storage
      .from('motorcycle-images')
      .upload(imagePath, file);

    if (uploadError) throw uploadError;

    // Create and upload thumbnail
    const thumbnail = await createThumbnail(file);
    const { error: thumbError } = await supabase.storage
      .from('motorcycle-images')
      .upload(thumbnailPath, thumbnail);

    if (thumbError) throw thumbError;

    // Get public URLs
    const { data: imageUrlData } = supabase.storage
      .from('motorcycle-images')
      .getPublicUrl(imagePath);

    const { data: thumbnailUrlData } = supabase.storage
      .from('motorcycle-images')
      .getPublicUrl(thumbnailPath);

    return {
      imageUrl: imageUrlData.publicUrl,
      thumbnailUrl: thumbnailUrlData.publicUrl,
    };
  } catch (error: any) {
    toast.error(`Error uploading image: ${error.message}`);
    throw error;
  }
};

/**
 * Upload a document file (insurance or registration)
 */
export const uploadDocument = async (
  userId: string,
  file: File,
  type: 'insurance' | 'registration'
): Promise<string> => {
  try {
    // Create unique file path
    const timestamp = new Date().getTime();
    const docPath = `${userId}/${type}_${timestamp}.${file.name.split('.').pop()}`;

    // Upload document
    const { error: uploadError } = await supabase.storage
      .from('motorcycle-documents')
      .upload(docPath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: docUrlData } = supabase.storage
      .from('motorcycle-documents')
      .getPublicUrl(docPath);

    return docUrlData.publicUrl;
  } catch (error: any) {
    toast.error(`Error uploading document: ${error.message}`);
    throw error;
  }
};
