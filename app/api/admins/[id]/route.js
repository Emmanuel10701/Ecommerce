import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../libs/prismadb';

// GET request: Retrieve a single admin by ID
export async function GET(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: String(id) },
    });

    if (!admin) {
      return new NextResponse(
        JSON.stringify({ message: 'Admin not found' }),
        { status: 404 }
      );
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// PUT request: Update an admin by ID
export async function PUT(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL
  const body = await req.json();
  const { name, role } = body; // Add fields you want to update

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    const updatedAdmin = await prisma.admin.update({
      where: { id: String(id) },
      data: {
        name,
        role, // Ensure you handle role correctly, according to your model
      },
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// DELETE request: Delete an admin by ID
export async function DELETE(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    const deletedAdmin = await prisma.admin.delete({
      where: { id: String(id) },
    });

    // Optionally, remove the ADMIN role from the user
    await prisma.user.update({
      where: { id: String(id) },
      data: { role: 'USER' }, // or whatever the default role is
    });

    return NextResponse.json(deletedAdmin);
  } catch (error) {
    console.error('Error deleting admin:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error deleting admin', details: error.message }),
      { status: 500 }
    );
  }
}
