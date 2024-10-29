import { NextResponse } from 'next/server';
import prisma from '../../../../libs/prismadb'; // Adjust the path as needed

// GET request to fetch a single product by ID
export async function GET(request, { params }) {
  // Ensure params are awaited
  const { id } = await params; 

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT request to update a product by ID
export async function PUT(request, { params }) {
  // Ensure params are awaited
  const { id } = await params; 
  const data = await request.json();

  try {
    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE request to remove a product by ID
export async function DELETE(request, { params }) {
  // Ensure params are awaited
  const { id } = await params; 

  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
