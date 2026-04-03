import { useState, useRef } from 'react';
import { useLanguage } from '../LanguageContext';

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function FileIcon({ type }) {
  if (type === 'application/pdf') {
    return (
      <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export default function UploadZone({ onFilesSelect, disabled }) {
  const { t } = useLanguage();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputRef = useRef(null);

  const addFiles = (newFiles) => {
    const valid = Array.from(newFiles).filter((f) => ACCEPTED_TYPES.includes(f.type));
    if (valid.length === 0) return;
    setSelectedFiles((prev) => {
      const combined = [...prev, ...valid];
      onFilesSelect(combined);
      return combined;
    });
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onFilesSelect(updated);
      return updated;
    });
  };

  const clearAll = () => {
    setSelectedFiles([]);
    onFilesSelect([]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-gray-700'
            : dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-600 hover:border-primary/50 hover:bg-white/[0.02]'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.gif"
          multiple
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-300">
              {t('dropzone')}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t('dropzoneHint')}
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      {selectedFiles.length > 0 && (
        <div className="bg-dark-800 rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <p className="text-sm text-gray-300 font-medium">
              {selectedFiles.length} {t('filesSelected')}
              <span className="text-gray-500 ml-2">({(totalSize / 1024).toFixed(0)} KB total)</span>
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              {t('clearAll')}
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {selectedFiles.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02]">
                <div className="flex items-center gap-3 min-w-0">
                  <FileIcon type={file.type} />
                  <span className="text-sm text-gray-300 truncate">{file.name}</span>
                  <span className="text-xs text-gray-600 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="text-gray-600 hover:text-red-400 transition-colors ml-3 shrink-0"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
