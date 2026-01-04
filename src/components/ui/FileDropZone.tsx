
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, FileType, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileDropZoneProps {
    onFileAccepted: (file: File) => void;
    accept?: string; // e.g., "image/*"
    maxSizeMB?: number; // e.g. 50
    className?: string;
}

export const FileDropZone = ({ onFileAccepted, accept, maxSizeMB = 50, className }: FileDropZoneProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Prevent default browser behavior for drag/drop to stop reloads
    const preventDefaults = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        preventDefaults(e);
        setIsDragging(true);
    }, [preventDefaults]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        preventDefaults(e);
        setIsDragging(false);
    }, [preventDefaults]);

    const validateFile = (file: File) => {
        setError(null);
        // Check size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File too large. Max size is ${maxSizeMB}MB.`);
            return false;
        }
        // Check type (simple check)
        if (accept) {
            const acceptedTypes = accept.split(',').map(t => t.trim());
            // Wildcard support e.g. image/*
            const isMatch = acceptedTypes.some(type => {
                if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -2));
                return file.type === type;
            });
            if (!isMatch) {
                setError(`Invalid file type. Accepted: ${accept}`);
                return false;
            }
        }
        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        preventDefaults(e);
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                onFileAccepted(file);
            }
        }
    }, [preventDefaults, onFileAccepted, accept, maxSizeMB]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                onFileAccepted(file);
            }
        }
    };

    return (
        <div
            className={cn(
                "relative group cursor-pointer transition-all duration-300 ease-out",
                className
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={preventDefaults}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload-input')?.click()}
        >
            <input
                id="file-upload-input"
                type="file"
                className="hidden"
                onChange={handleChange}
                accept={accept}
            />

            <div className={cn(
                "border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center text-center p-8 transition-all duration-300 bg-white",
                isDragging ? "border-primary bg-primary/5 scale-[1.02] shadow-xl" : "border-gray-200 hover:border-primary/50 hover:bg-gray-50",
                error ? "border-destructive/50 bg-destructive/5" : ""
            )}>
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {error ? <XCircle className="w-8 h-8 text-destructive" /> : <UploadCloud className="w-8 h-8 text-primary" />}
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {isDragging ? "Drop to Upload" : "Upload Media"}
                </h3>

                <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                    {error ? <span className="text-destructive font-medium">{error}</span> : "Drag & drop or click to browse"}
                </p>

                <div className="flex gap-4 text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1"><FileType className="w-3 h-3" /> JPG</span>
                    <span className="flex items-center gap-1"><FileType className="w-3 h-3" /> MP4</span>
                    <span className="flex items-center gap-1"><FileType className="w-3 h-3" /> MP3</span>
                </div>
            </div>
        </div>
    );
};
