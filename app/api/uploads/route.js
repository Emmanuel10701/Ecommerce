// pages/api/upload.js
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable body parsing for the API route
export const dynamic = 'force-dynamic'; // Or use 'force-static' depending on your use case

export async function handler(req) {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return resolve(NextResponse.json({ error: 'Image upload failed' }, { status: 500 }));
      }

      const file = files.file[0];
      try {
        const result = await cloudinary.uploader.upload(file.filepath);
        return resolve(NextResponse.json({ url: result.secure_url }, { status: 200 }));
      } catch (uploadError) {
        const errorMessage = uploadError.message || 'Upload failed';
        return resolve(NextResponse.json({ error: errorMessage }, { status: 500 }));
      }
    });
  });
}
