import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb'; // Adjust the path as needed
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const oldPrice = formData.get('oldPrice') as string | undefined;
    const quantity = formData.get('quantity') as string | null;
    const category = formData.get('category') as string | undefined; // Ensure this is correct
    const ratings = formData.get('ratings') as string;
    const imageFile = formData.get('image') as File | null;

    if (!name || !description || !price || !ratings || !quantity || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl: string | null = null;
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
      } catch (fileError: any) {
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
          category, // Ensure this matches your Prisma schema
          image: imageUrl,
        },
      });

      return NextResponse.json(newProduct);
    } catch (dbError: any) {
      console.error('Database operation error:', dbError.message);
      return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET request handler to fetch all products, ordered by createdAt in descending order
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc', // Order products by `createdAt` field in descending order
      },
    });

    return NextResponse.json(products);
  } catch (dbError: any) {
    console.error('Database operation error:', dbError.message);
    return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
  }
}
