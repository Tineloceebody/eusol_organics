'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { ProductMedia } from '@/lib/types';

interface MediaUploaderProps {
  onUploadSuccess(media: ProductMedia): void;
}

const acceptedFileTypes = {
  'image/*': [],
  'video/mp4': [],
  'video/webm': [],
};

export default function MediaUploader({ onUploadSuccess }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<ProductMedia[]>([]);

  const uploadFile = (file: File) => {
    return new Promise<ProductMedia>((resolve, reject) => {
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = snapshot.totalBytes
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            : 0;
          setProgress(percent);
        },
        (uploadError) => {
          reject(uploadError);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const media: ProductMedia = {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              type: fileType,
              url: downloadURL,
              altText: file.name,
              isPrimary: false,
              uploadedAt: new Date(),
              fileName: file.name,
            };
            resolve(media);
          } catch (fetchError) {
            reject(fetchError);
          }
        }
      );
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      setUploading(true);
      setError(null);
      setProgress(0);

      try {
        await Promise.all(
          acceptedFiles.map(async (file) => {
            if (
              !file.type.startsWith('image/') &&
              file.type !== 'video/mp4' &&
              file.type !== 'video/webm'
            ) {
              throw new Error('Only images and MP4 / WEBM videos are supported.');
            }

            const media = await uploadFile(file);
            onUploadSuccess(media);
            setPreviews((current) => [media, ...current]);
            return media;
          })
        );
      } catch (uploadError: unknown) {
        setError((uploadError as Error)?.message ?? 'Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: true,
    disabled: uploading,
  });

  return (
    <div className="rounded-[28px] border border-[#D7C7A7] bg-[#F9F5EE] p-5 shadow-sm">
      <div
        {...getRootProps()}
        className={`min-h-[220px] rounded-[28px] border-2 border-dashed transition-colors duration-200 ${
          isDragActive ? 'border-[#A18A68] bg-[#EFE5CF]' : 'border-[#D7C7A7] bg-white'
        } flex flex-col items-center justify-center gap-4 text-center px-4 py-8`}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-semibold text-[#5B4D3B]">Drag and drop images or videos here</p>
        <p className="max-w-xl text-xs text-[#7B6B4B]">
          Supported file types: JPG, PNG, MP4, WEBM. Files upload automatically when dropped.
        </p>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-[#5B4D3B] mb-2">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E4D7C3]">
            <div
              className="h-full rounded-full bg-[#A18A68] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl border border-[#E3B76B] bg-[#FBF1D8] px-4 py-3 text-sm text-[#7B4E19]">
          {error}
        </div>
      )}

      {previews.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5B4D3B]">
            Recent uploads
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {previews.map((media) => (
              <div key={media.id} className="overflow-hidden rounded-3xl border border-[#D7C7A7] bg-white shadow-sm">
                {media.type === 'image' ? (
                  <img src={media.url} alt={media.altText} className="h-40 w-full object-cover" />
                ) : (
                  <video controls src={media.url} className="h-40 w-full bg-black object-cover" />
                )}
                <div className="space-y-1 px-4 py-3">
                  <p className="text-sm font-semibold text-[#3C3A36]">{media.fileName}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#7B6B4B]">
                    {media.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
