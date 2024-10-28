import { v2 as cloudinary } from 'cloudinary';
import formidable, { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable body parsing for the API route
export const dynamic = 'force-dynamic'; // Or use 'force-static' depending on your use case

const uploadImage = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Image upload failed' });
      return;
    }

    const file = files.file[0];
    try {
      const result = await cloudinary.uploader.upload(file.filepath);
      res.status(200).json({ url: result.secure_url });
    } catch (uploadError) {
      // Type guard to check if uploadError has a message property
      const errorMessage = (uploadError as { message?: string }).message || 'Upload failed';
      res.status(500).json({ error: errorMessage });
    }
  });
};

// Export the uploadImage function as default
export default uploadImage;
