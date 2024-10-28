// pages/api/customers/index.js
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb'; // Adjust the path if needed

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (id) {
    // Fetch a single customer by ID
    try {
      const customer = await prisma.customer.findUnique({
        where: { id },
      });
      if (customer) {
        return NextResponse.json(customer);
      } else {
        return new NextResponse(JSON.stringify({ error: 'Customer not found' }), { status: 404 });
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      return new NextResponse(JSON.stringify({ error: 'Error fetching customer' }), { status: 500 });
    }
  } else {
    // Fetch all customers
    try {
      const customers = await prisma.customer.findMany();
      return NextResponse.json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      return new NextResponse(JSON.stringify({ error: 'Error fetching customers' }), { status: 500 });
    }
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phoneNumber, address, userId } = body;

    // Validate required fields
    if (!name || !email || !address || !userId) {
      return new NextResponse(JSON.stringify({ error: 'Name, email, address, and userId are required' }), { status: 400 });
    }

    // Create a new customer
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        phoneNumber: phoneNumber || '', // Provide default value if phoneNumber is not provided
        address,
        userId,
      },
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return new NextResponse(JSON.stringify({ error: 'Error creating customer' }), { status: 500 });
  }
}

// Handle other methods
export async function handler(req) {
  return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
}
