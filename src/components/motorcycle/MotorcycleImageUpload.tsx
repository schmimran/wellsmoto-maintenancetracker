
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { uploadMotorcycleImage } from '@/utils/fileUtils';

interface MotorcycleImageUploadProps {
  userId: string;
  onUploadComplete: (imageUrl: string, thumbnailUrl: string) => void;
  existingImageUrl?: string | null;
}

const MotorcycleImageUpload = ({
  userId,
  onUploadComplete,
  existingImageUrl,
}: MotorcycleImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl || null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type (image only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (JPEG, PNG, WebP, or GIF)');
      return;
    }
    
    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    try {
      setIsUploading(true);
      const { imageUrl, thumbnailUrl } = await uploadMotorcycleImage(userId, file);
      onUploadComplete(imageUrl, thumbnailUrl);
    } catch (error) {
      console.error('Error uploading motorcycle image:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-muted-foreground">Motorcycle Image</label>
      <div className="flex flex-col gap-2 items-center">
        {previewUrl ? (
          <div className="relative w-full max-w-md aspect-video bg-muted rounded-md overflow-hidden">
            <img
              src={previewUrl}
              alt="Motorcycle preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full max-w-md aspect-video bg-muted rounded-md p-4">
            <Image className="h-12 w-12 text-gray-400" />
            <p className="text-sm text-muted-foreground mt-2">No image uploaded</p>
          </div>
        )}
        
        <div className="mt-2">
          <label htmlFor="motorcycle-image-upload">
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={isUploading}
              type="button"
            >
              {isUploading ? 'Uploading...' : previewUrl ? 'Replace Image' : 'Upload Image'}
            </Button>
            <input
              id="motorcycle-image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="sr-only"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default MotorcycleImageUpload;
