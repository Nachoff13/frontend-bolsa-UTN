"use client";

import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  LinearProgress,
  Stack,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  uploadedFileName?: string;
  accept?: string;
  maxSize?: number; // en MB
  error?: string;
}

export default function FileUpload({
  onFileSelect,
  onUpload,
  isUploading = false,
  uploadedFileName,
  accept = ".pdf",
  maxSize = 5,
  error,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    // Validar tipo de archivo
    if (accept === ".pdf" && file.type !== "application/pdf") {
      return;
    }

    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Box
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        <Stack spacing={2} alignItems="center">
          <CloudUpload 
            sx={{ 
              fontSize: 48, 
              color: dragActive ? 'primary.main' : 'grey.400' 
            }} 
          />
          
          <Typography variant="h6" color="text.secondary">
            {dragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta tu CV aquí'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            o haz clic para seleccionar un archivo
          </Typography>

          <Chip
            label={`Solo archivos ${accept} (máximo ${maxSize}MB)`}
            size="small"
            variant="outlined"
            color="primary"
          />
        </Stack>
      </Box>

      {selectedFile && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Description color="primary" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(selectedFile.size)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={isUploading}
              startIcon={isUploading ? <LinearProgress /> : <CloudUpload />}
            >
              {isUploading ? 'Subiendo...' : 'Subir CV'}
            </Button>
          </Stack>
        </Box>
      )}

      {uploadedFileName && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircle color="success" />
            <Typography variant="body2" color="success.main">
              CV subido exitosamente: {uploadedFileName}
            </Typography>
          </Stack>
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          icon={<ErrorIcon />}
          sx={{ mt: 2 }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}
