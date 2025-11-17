import React, { useRef } from 'react';

// --- Icons ---
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

interface FileInputProps {
  label: string;
  onFileSelect: (dataUrl: string | null) => void;
  value: string | null;
  isLoading?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({ label, onFileSelect, value, isLoading = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const instanceId = useRef(Math.random().toString(36).substring(2)).current;
  const inputId = `file-upload-${label.replace(/\s+/g, '-').toLowerCase()}-${instanceId}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="mt-1">
        <input
          ref={fileInputRef}
          id={inputId}
          name={inputId}
          type="file"
          className="sr-only"
          onChange={handleFileChange}
          accept="image/*"
        />
        {value && !isLoading ? (
          <div className="relative w-32 h-32 group">
            <img src={value} alt="Preview" className="w-full h-full rounded-lg object-cover shadow-md" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-4 rounded-lg">
                <label
                    htmlFor={inputId}
                    className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-white bg-gray-700/80 rounded-full p-2 hover:bg-gray-900"
                    aria-label="Change image"
                >
                    <EditIcon />
                </label>
                <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-red-600/80 rounded-full p-2 hover:bg-red-700"
                    aria-label="Remove image"
                >
                    <DeleteIcon />
                </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="w-32 h-32 flex items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-gray-50 transition-colors relative"
          >
            {isLoading ? (
              <div className="absolute inset-0 bg-white/80 flex flex-col justify-center items-center rounded-md z-10">
                <svg className="animate-spin h-10 w-10 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-sm font-semibold text-gray-600">در حال ساخت...</p>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <CameraIcon />
                <p className="text-xs text-gray-500">بارگذاری تصویر</p>
              </div>
            )}
          </label>
        )}
      </div>
    </div>
  );
};

export default FileInput;
