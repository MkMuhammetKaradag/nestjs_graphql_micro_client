import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageDropzoneProps {
  onImagesUpload: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onImagesUpload,
  multiple = false,
  maxFiles = 3,
}) => {
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; file: File }[]
  >([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple && images.length + acceptedFiles.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images.`);
        return;
      }

      const newImages: { id: string; url: string }[] = [];
      const newFiles: { id: string; file: File }[] = [];
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        const id = URL.createObjectURL(file);
        reader.onloadend = () => {
          newImages.push({ id, url: reader.result as string });

          if (multiple) {
            setImages((prevImages) => [
              ...prevImages,
              { id, url: reader.result as string },
            ]);
            setUploadedFiles((prevFiles) => [...prevFiles, { id, file }]);
          } else {
            setImages([{ id, url: reader.result as string }]);
            setUploadedFiles([{ id, file }]);
          }
        };
        reader.readAsDataURL(file);
        newFiles.push({ id, file });
      });

      //   onImagesUpload(multiple ? [...uploadedFiles, ...newFiles] : newFiles);
    },
    [multiple, images.length, maxFiles, uploadedFiles]
  );

  const handleDeleteImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((fileObj) => fileObj.id !== id)
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple,
    maxFiles,
  });

  return (
    <div className="max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">
          {isDragActive
            ? `Drop the ${multiple ? 'images' : 'image'} here ...`
            : `Drag & drop ${
                multiple ? 'images' : 'an image'
              } here, or click to select ${multiple ? 'images' : 'an image'}`}
        </p>
        {multiple && images.length >= maxFiles && (
          <p className="text-red-500 text-sm mt-2">
            You can only upload up to {maxFiles} images.
          </p>
        )}
      </div>
      <div className={`mt-4 grid ${multiple ? 'grid-cols-3' : ''} gap-4`}>
        {images.map((image) => (
          <div key={image.id} className="relative">
            <img
              src={image.url}
              alt="uploaded"
              className="w-full h-auto rounded-lg shadow-md"
            />
            <button
              onClick={() => handleDeleteImage(image.id)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700 focus:outline-none"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div>
        <button
          disabled={uploadedFiles.length === 0}
          className="bg-red-500 p-3 text-white mt-3"
          onClick={() => onImagesUpload([...uploadedFiles.map((f) => f.file)])}
        >
          send
        </button>
      </div>
    </div>
  );
};

export default ImageDropzone;
