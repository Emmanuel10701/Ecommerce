import prisma from '../../../../libs/prismadb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id'); // Get order ID from query params

    try {
        // Fetch order by ID
        const order = await prisma.order.findUnique({
            where: { id: orderId || undefined },
            include: { orderItems: true, customer: true }, // Include related data
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id'); // Get order ID from query params

    if (!orderId) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        // Check if the order exists before deleting
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!existingOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Delete the order
        await prisma.order.delete({
            where: { id: orderId },
        });

        return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
