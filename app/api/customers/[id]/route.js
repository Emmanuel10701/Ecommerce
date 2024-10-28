// pages/api/customers/[id].js
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../libs/prismadb'; // Adjust the path if needed

// GET request: Retrieve a single customer by ID
export async function GET(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'Customer ID is required' }),
      { status: 400 }
    );
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: String(id) },
    });

    if (!customer) {
      return new NextResponse(
        JSON.stringify({ error: 'Customer not found' }),
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error fetching customer' }),
      { status: 500 }
    );
  }
}

// PUT request: Update a customer by ID
export async function PUT(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL
  const body = await req.json();
  const { name, email, address, phoneNumber } = body; // Add fields you want to update

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'Customer ID is required' }),
      { status: 400 }
    );
  }

  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id: String(id) },
      data: {
        name,
        email,
        address,
        phoneNumber,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error updating customer' }),
      { status: 500 }
    );
  }
}

// DELETE request: Delete a customer by ID
export async function DELETE(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'Customer ID is required' }),
      { status: 400 }
    );
  }

  try {
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: String(id) },
    });

    if (!existingCustomer) {
      return new NextResponse(
        JSON.stringify({ error: 'Customer not found' }),
        { status: 404 }
      );
    }

    // Delete the customer
    await prisma.customer.delete({
      where: { id: String(id) },
    });

    return new NextResponse(
      JSON.stringify({ message: 'Customer deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting customer:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error deleting customer' }),
      { status: 500 }
    );
  }
}
