
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { uploadDocument } from '@/utils/fileUtils';

interface DocumentUploadProps {
  userId: string;
  documentType: 'insurance' | 'registration';
  onUploadComplete: (url: string) => void;
  existingUrl?: string | null;
}

const DocumentUpload = ({
  userId,
  documentType,
  onUploadComplete,
  existingUrl,
}: DocumentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type (PDF or image)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or image file');
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    try {
      setIsUploading(true);
      const docUrl = await uploadDocument(userId, file, documentType);
      onUploadComplete(docUrl);
      toast.success(`${documentType.charAt(0).toUpperCase() + documentType.slice(1)} document uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading ${documentType} document:`, error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const documentTypeLabel = documentType.charAt(0).toUpperCase() + documentType.slice(1);
  
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-muted-foreground">{documentTypeLabel} Document</label>
      <div className="flex items-center gap-2">
        {existingUrl ? (
          <div className="flex items-center gap-2">
            <a 
              href={existingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              View {documentTypeLabel} Doc
            </a>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No document uploaded</span>
        )}
        
        <div>
          <label htmlFor={`${documentType}-upload`}>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={isUploading}
              type="button"
            >
              {isUploading ? 'Uploading...' : existingUrl ? 'Replace' : 'Upload'}
            </Button>
            <input
              id={`${documentType}-upload`}
              type="file"
              accept="application/pdf, image/jpeg, image/png"
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

export default DocumentUpload;
