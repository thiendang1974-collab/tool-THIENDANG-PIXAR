import React, { useRef, useState } from 'react';
import type { ImageFile, ImageTransform } from '../types';
import { UploadIcon, XIcon } from './icons';

interface ImageUploaderProps {
  label: string;
  image: ImageFile | null;
  onImageChange: (image: ImageFile | null) => void;
  className?: string;
  isTransformable?: boolean;
  transform?: ImageTransform;
  onTransformChange?: (transform: ImageTransform) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  image,
  onImageChange,
  className = '',
  isTransformable = false,
  transform,
  onTransformChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onImageChange(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTransformable || !transform) return;
    e.preventDefault();
    setIsDragging(true);
    setStartDragPos({
      x: e.clientX - transform.position.x,
      y: e.clientY - transform.position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isTransformable || !transform || !onTransformChange) return;
    e.preventDefault();
    const newPosition = {
      x: e.clientX - startDragPos.x,
      y: e.clientY - startDragPos.y,
    };
    onTransformChange({ ...transform, position: newPosition });
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isTransformable || !transform || !onTransformChange) return;
    e.preventDefault();
    const scaleAmount = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(1, Math.min(5, transform.scale + scaleAmount));
    onTransformChange({ ...transform, scale: newScale });
  };

  const renderImagePreview = () => {
    if (!image) return null;

    if (isTransformable && transform) {
      return (
        <div
          className={`relative w-full h-full overflow-hidden select-none rounded-lg ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
        >
          <img
            src={image.preview}
            alt="Preview"
            draggable={false}
            className="absolute top-0 left-0 w-full h-full object-contain"
            style={{
              transform: `translate(${transform.position.x}px, ${transform.position.y}px) scale(${transform.scale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              willChange: 'transform',
            }}
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-red-500 transition-colors z-10"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        <img src={image.preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
        <button
          onClick={handleRemoveImage}
          className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-red-500 transition-colors"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="w-full h-32 bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 flex justify-center items-center hover:bg-slate-700 hover:border-slate-500 transition-colors duration-300">
        <input type="file" accept="image/*" className="hidden" ref={inputRef} onChange={handleFileChange} />
        {image ? (
          renderImagePreview()
        ) : (
          <div
            className="text-center text-gray-400 cursor-pointer w-full h-full flex flex-col justify-center items-center"
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon className="w-8 h-8 mx-auto mb-1" />
            <p className="text-xs">+ Tải ảnh lên</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;