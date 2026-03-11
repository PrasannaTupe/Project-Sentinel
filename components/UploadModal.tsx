
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileVideo, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        if (!file.type.startsWith('video/')) {
            setError('Please upload a valid video file (MP4, MOV, etc.)');
            return;
        }
        setFile(file);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            await api.uploadMeeting(file);
            setSuccess(true);
            setFile(null);
            setTimeout(() => {
                onUploadComplete();
                onClose();
                setSuccess(false);
                setIsUploading(false);
            }, 1500);
        } catch (err: any) {
            console.error(err);
            setError('Upload failed. Please try again.');
            setIsUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-lg bg-[#0f1115] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Upload className="w-5 h-5 text-blue-400" />
                                Upload Meeting Recording
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {!file ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`
                    group relative h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300
                    ${isDragOver
                                            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
                                            : 'border-white/10 hover:border-blue-400/50 hover:bg-white/5'
                                        }
                  `}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="video/*"
                                        className="hidden"
                                    />

                                    <div className={`p-4 rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300`}>
                                        <Upload className="w-8 h-8" />
                                    </div>

                                    <div className="text-center space-y-1">
                                        <p className="text-lg font-medium text-white group-hover:text-blue-200 transition-colors">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            MP4, MOV, WEBM (Max 500MB)
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* File Preview */}
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                            <FileVideo className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">{file.name}</p>
                                            <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                        <button
                                            onClick={() => setFile(null)}
                                            disabled={isUploading || success}
                                            className="p-2 hover:bg-white/10 rounded-full text-gray-400 disabled:opacity-50"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Success Message */}
                                    {success && (
                                        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-3 rounded-xl justify-center font-bold">
                                            <CheckCircle className="w-5 h-5" />
                                            Upload Successful! Processing...
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <button
                                        onClick={handleUpload}
                                        disabled={isUploading || success}
                                        className={`
                      w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                      ${isUploading || success
                                                ? 'bg-blue-600/50 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]'
                                            }
                    `}
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing Meeting...
                                            </>
                                        ) : success ? (
                                            'Done'
                                        ) : (
                                            <>
                                                Process Recording
                                                <CheckCircle className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>

                                    {isUploading && (
                                        <p className="text-xs text-center text-gray-500 animate-pulse">
                                            This may take a few minutes depending on video length.
                                            <br />Extracting Audio → Transcribing → Analysing...
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
