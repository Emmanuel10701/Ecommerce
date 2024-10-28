import { NextResponse } from 'next/server';
import prisma from '../../../../libs/prismadb'; // Adjust the import path as necessary

// GET handler to fetch a single event by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: String(id) },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.error();
  }
}

// PUT handler to update an event
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { title, date, color } = await request.json();

  if (!id || !title || !date || !color) {
    return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
  }

  try {
    const updatedEvent = await prisma.event.update({
      where: { id: String(id) },
      data: { title, date, color },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.error();
  }
}

// DELETE handler to delete an event
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
  }

  try {
    const deletedEvent = await prisma.event.delete({
      where: { id: String(id) },
    });

    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.error();
  }
}
