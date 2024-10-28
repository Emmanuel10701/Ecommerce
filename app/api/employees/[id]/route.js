import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../libs/prismadb'; // Adjust the path if needed

// GET request: Retrieve a single employee by ID
export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'Employee ID is required.' }),
      { status: 400 }
    );
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: String(id) },
    });

    if (!employee) {
      return new NextResponse(
        JSON.stringify({ error: 'Employee not found.' }),
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error: any) {
    console.error('Error fetching employee:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error fetching employee.' }),
      { status: 500 }
    );
  }
}

// PUT request: Update an employee by ID
export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL
  const body = await req.json();
  const { name, role, userId } = body; // Adjust fields as necessary

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'Employee ID is required.' }),
      { status: 400 }
    );
  }

  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id: String(id) },
      data: {
        name,
        role,
        userId, // Include userId if needed for the relation
      },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error: any) {
    console.error('Error updating employee:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error updating employee.' }),
      { status: 500 }
    );
  }
}

// DELETE request: Delete a single employee by ID
export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'Employee ID is required.' }),
      { status: 400 }
    );
  }

  try {
    const deletedEmployee = await prisma.employee.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ message: 'Employee deleted successfully.', employee: deletedEmployee });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    if (error.code === 'P2025') { // Prisma error code for not found
      return new NextResponse(JSON.stringify({ error: 'Employee not found.' }), { status: 404 });
    }
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete employee. Please try again later.', details: error.message }),
      { status: 500 }
    );
  }
}
