import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

// Handler for GET (List Events) and POST (Create Event)
export async function GET(request: Request) {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  const {  title, date, color } = await request.json();
  if (!title || !date || !color) {
    return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
  }
  try {
    const newEvent = await prisma.event.create({
      data: { title, date, color },
    });
    return NextResponse.json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.error();
  }
}
