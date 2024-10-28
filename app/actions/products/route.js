import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb'; // Adjust the path as needed
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const oldPrice = formData.get('oldPrice');
    const quantity = formData.get('quantity');
    const category = formData.get('category');
    const ratings = formData.get('ratings');
    const imageFile = formData.get('image');

    if (!name || !description || !price || !ratings || !quantity || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl = null;
    if (imageFile) {
      try {
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, imageFile.name);
        const buffer = Buffer.from(await imageFile.arrayBuffer());

        fs.writeFileSync(filePath, buffer);
        imageUrl = `/uploads/${imageFile.name}`;
      } catch (fileError) {
        console.error('File upload error:', fileError.message);
        return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
      }
    }

    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          oldPrice: oldPrice ? parseFloat(oldPrice) : null,
          quantity: quantity ? parseInt(quantity) : null,
          ratings: parseFloat(ratings),
          category,
          image: imageUrl,
        },
      });

      return NextResponse.json(newProduct);
    } catch (dbError) {
      console.error('Database operation error:', dbError.message);
      return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET request handler to fetch all products, ordered by createdAt in descending order
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (dbError) {
    console.error('Database operation error:', dbError.message);
    return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
  }
}
