export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFile = (file: File): ValidationResult => {
  // Check file type
  const validTypes = ['image/heic', 'image/heif'];
  const validExtensions = ['.heic', '.heif'];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );

  if (!hasValidType && !hasValidExtension) {
    return {
      isValid: false,
      error: 'Please select only HEIC or HEIF files'
    };
  }

  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 50MB'
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File appears to be empty'
    };
  }

  return { isValid: true };
};

export const validateFiles = (files: File[]): ValidationResult => {
  if (files.length === 0) {
    return {
      isValid: false,
      error: 'Please select at least one file'
    };
  }

  // Check total number of files (limit to 50)
  if (files.length > 50) {
    return {
      isValid: false,
      error: 'Maximum 50 files allowed at once'
    };
  }

  // Validate each file
  for (const file of files) {
    const result = validateFile(file);
    if (!result.isValid) {
      return {
        isValid: false,
        error: `${file.name}: ${result.error}`
      };
    }
  }

  return { isValid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};