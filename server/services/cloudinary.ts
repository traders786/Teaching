import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'node:stream';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'kklm0fui',
  api_key: process.env.CLOUDINARY_API_KEY || '515694151159568',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'f5ASgB6vqMIXmyFqSwAguGLQPjM',
  secure: true,
});

export interface UploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  original_filename: string;
  resource_type: string;
}

/**
 * Uploads a memory buffer (PDF, Image, Doc) directly to Cloudinary
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  originalFilename: string,
  folder = 'upspeaq/homework'
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    // Sanitize filename (remove extension for public_id)
    const cleanName = originalFilename
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const publicId = `${cleanName}_${timestamp}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'auto', // Handles images, raw documents, and PDFs automatically
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error);
          return reject(error || new Error('Upload failed'));
        }

        resolve({
          url: result.url,
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format || 'pdf',
          bytes: result.bytes,
          original_filename: originalFilename,
          resource_type: result.resource_type,
        });
      }
    );

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  });
}

export { cloudinary };
