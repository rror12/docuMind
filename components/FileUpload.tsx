import React, { useState, useCallback } from 'react';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import { DocStatus } from '../types';
import { DocumentIcon } from './icons/DocumentIcon';
import { LinkIcon } from './icons/LinkIcon';
import { Spinner } from './Spinner';

interface FileUploadProps {
  onProcess: (files: File[], urls: string[]) => void;
  status: DocStatus;
}

const statusConfig = {
    [DocStatus.IDLE]: { text: 'Process Sources', color: 'bg-emerald-600 hover:bg-emerald-500', icon: null },
    [DocStatus.PROCESSING]: { text: 'Processing...', color: 'bg-stone-600', icon: <Spinner /> },
    [DocStatus.READY]: { text: 'Ready', color: 'bg-green-600', icon: '✓' },
    [DocStatus.ERROR]: { text: 'Error', color: 'bg-red-600', icon: '✗' },
};


export const FileUpload: React.FC<FileUploadProps> = ({ onProcess, status }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  const handleAddUrl = (e: FormEvent) => {
    e.preventDefault();
    const trimmedUrl = urlInput.trim();
    if (trimmedUrl) {
      try {
        new URL(trimmedUrl);
        if (urls.includes(trimmedUrl)) {
            setUrlError("URL has already been added.");
        } else {
            setUrls(prev => [...prev, trimmedUrl]);
            setUrlInput('');
            setUrlError(null);
        }
      } catch (_) {
        setUrlError("Please enter a valid URL (e.g., https://example.com).");
      }
    }
  };
  
  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleProcessClick = useCallback(() => {
    if (status !== DocStatus.PROCESSING) {
      onProcess(files, urls);
    }
  }, [files, urls, onProcess, status]);

  const config = statusConfig[status];
  const hasSources = files.length > 0 || urls.length > 0;

  return (
    <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 h-full flex flex-col space-y-4 shadow-2xl shadow-black/20">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-stone-100">Upload Sources</h2>
        <p className="text-stone-400 mt-1">Add files and URLs to begin.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="url-input" className="text-stone-300 font-medium text-sm">Add from URL</label>
        <form onSubmit={handleAddUrl} className="flex items-start space-x-2">
            <div className="flex-grow">
                <input
                    id="url-input"
                    type="text"
                    value={urlInput}
                    onChange={(e) => { setUrlInput(e.target.value); setUrlError(null); }}
                    placeholder="Enter YouTube or web URL"
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                />
                {urlError && <p className="text-red-500 text-xs mt-1 px-1">{urlError}</p>}
            </div>
            <button type="submit" className="bg-stone-700 text-stone-200 rounded-lg px-4 py-2 hover:bg-stone-600 transition-colors duration-300 disabled:opacity-50 flex-shrink-0" disabled={!urlInput.trim()}>
                Add
            </button>
        </form>
      </div>
      
      <div className="flex items-center text-center">
        <div className="flex-grow border-t border-stone-700"></div>
        <span className="flex-shrink mx-4 text-stone-500 text-sm">OR</span>
        <div className="flex-grow border-t border-stone-700"></div>
      </div>
      
      <div 
        className={`flex flex-col justify-center items-center border-2 border-dashed ${isDragging ? 'border-emerald-500 bg-emerald-900/20' : 'border-stone-700'} rounded-lg p-6 text-center transition-colors duration-300`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <DocumentIcon className="w-12 h-12 text-stone-500 mb-3" />
        <label htmlFor="file-upload" className="cursor-pointer text-emerald-400 font-semibold hover:text-emerald-300">
          Choose files
          <input id="file-upload" type="file" multiple className="sr-only" onChange={onFileChange} />
        </label>
        <p className="text-stone-500 mt-1">or drag and drop</p>
        <p className="text-xs text-stone-600 mt-3">Supported: PDF, DOCX, TXT</p>
      </div>

      {hasSources && (
        <div className="space-y-3 max-h-40 overflow-y-auto pr-2 flex-grow">
          {urls.length > 0 && (
            <div>
              <h3 className="text-stone-300 font-medium mb-1 text-sm">Added URLs:</h3>
              <ul className="text-stone-400 text-sm space-y-1">
                {urls.map((url, index) => (
                  <li key={index} className="flex items-center justify-between bg-stone-800/50 p-1.5 rounded" title={url}>
                    <LinkIcon className="w-4 h-4 mr-2 flex-shrink-0 text-stone-500"/>
                    <span className="truncate flex-grow mr-2">{url}</span>
                    <button onClick={() => handleRemoveUrl(url)} className="text-stone-500 hover:text-red-500 transition-colors text-lg font-bold leading-none flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-stone-700">
                        &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {files.length > 0 && (
            <div className={urls.length > 0 ? 'mt-3' : ''}>
              <h3 className="text-stone-300 font-medium mb-1 text-sm">Selected files:</h3>
              <ul className="text-stone-400 text-sm space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center bg-stone-800/50 p-1.5 rounded" title={file.name}>
                    <DocumentIcon className="w-4 h-4 mr-2 flex-shrink-0 text-stone-500"/>
                    <span className="truncate flex-grow">{file.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleProcessClick}
        disabled={!hasSources || status === DocStatus.PROCESSING}
        className={`w-full ${config.color} text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-auto`}
      >
        {config.icon && <span className="mr-2">{config.icon}</span>}
        {config.text}
      </button>
    </div>
  );
};