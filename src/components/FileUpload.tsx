
import { ChangeEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  accept: string;
  maxSize?: number; // In MB
  onFileSelected: (file: File) => void;
  className?: string;
}

const FileUpload = ({ accept, maxSize = 10, onFileSelected, className }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = file.type;
    const validTypes = accept.split(',').map(type => type.trim());
    
    if (!validTypes.some(type => {
      if (type.includes('*')) {
        // Handle wildcards like "image/*"
        return fileType.startsWith(type.replace('/*', ''));
      }
      return type === fileType;
    })) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file with type: ${accept}`,
        variant: "destructive",
      });
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const processFile = (file: File) => {
    if (validateFile(file)) {
      setFile(file);
      onFileSelected(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setFile(null);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-all duration-200",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50",
          file ? "bg-muted/50" : "bg-transparent"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept={accept}
        />
        
        <Upload className={cn(
          "h-12 w-12 mb-4 transition-all duration-300",
          isDragging ? "text-primary animate-pulse" : "text-muted-foreground"
        )} />
        
        {file ? (
          <div className="flex flex-col items-center text-center animate-fade-in">
            <p className="font-medium text-lg">File selected</p>
            <p className="text-muted-foreground truncate max-w-full">{file.name}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFile} 
              className="mt-4"
            >
              Clear Selection
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <p className="font-medium text-lg">Drop your file here, or <span className="text-primary">browse</span></p>
            <p className="text-muted-foreground mt-1">
              Max file size: {maxSize}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
