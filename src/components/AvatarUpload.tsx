
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type AvatarUploadProps = {
  url: string | null;
  size?: number;
  onUpload: (url: string) => void;
};

const AvatarUpload = ({ url, size = 150, onUpload }: AvatarUploadProps) => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) setAvatarUrl(url);
  }, [url]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      onUpload(data.publicUrl);
      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      toast.error(error.message || 'Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    const name = user?.user_metadata?.name || 'User';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-[150px] h-[150px]">
        <AvatarImage src={avatarUrl || undefined} alt="Profile" />
        <AvatarFallback className="text-4xl bg-wells-red text-white">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      <div>
        <label htmlFor="avatar-upload">
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
};

export default AvatarUpload;
