import { ChangeEvent, useState } from 'react';

type FileUploadFieldProps = {
  label: string;
  name: string;
  accept?: string;
  onFileChange: (file: File | null) => void;
  previewUrl?: string;
  error?: string;
  isRequired?: boolean;
  className?: string;
};

export const FileUploadField = ({
  label,
  name,
  accept = 'image/*',
  onFileChange,
  previewUrl,
  error,
  isRequired = false,
  className = '',
}: FileUploadFieldProps) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Create a preview URL for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setLocalPreview(null);
      }
      
      onFileChange(file);
    } else {
      setLocalPreview(null);
      onFileChange(null);
    }
  };

  const displayPreview = previewUrl || localPreview;

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {isRequired && <span className="text-red-500"> *</span>}
      </label>
      
      <div className="mt-1 flex items-center">
        <label
          className={`cursor-pointer bg-white py-2 px-3 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
        >
          Télécharger un fichier
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
        <span className="ml-3 text-sm text-gray-500">
          {displayPreview ? 'Fichier sélectionné' : 'Aucun fichier sélectionné'}
        </span>
      </div>

      {displayPreview && (
        <div className="mt-2">
          {displayPreview.startsWith('data:image') ? (
            <img
              src={displayPreview}
              alt="Aperçu"
              className="h-32 w-auto object-cover rounded"
            />
          ) : (
            <div className="p-2 bg-gray-100 rounded border border-gray-200 text-sm">
              Fichier: {displayPreview.split('/').pop() || 'Fichier sélectionné'}
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
