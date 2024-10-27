import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb'; // Adjust the path if needed

// Handle POST request for creating a new employee
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, userId } = body;

    // Basic validation
    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Both name and userId are required.' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found. Please provide a valid userId.' },
        { status: 404 }
      );
    }

    // Create the new employee entry
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error:any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee. Please try again later.', details: error.message },
      { status: 500 }
    );
  }
}

// Handle GET request for fetching all employees
export async function GET(req: NextRequest) {
  try {
    // Fetch all employees
    const employees = await prisma.employee.findMany({
      include: { user: { select: { email: true } } }, // Include user info if needed
    });

    return NextResponse.json(employees);
  } catch (error:any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees. Please try again later.', details: error.message },
      { status: 500 }
    );
  }
}
