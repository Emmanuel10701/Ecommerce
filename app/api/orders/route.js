// pages/api/orders.js
import prisma from '../../../libs/prismadb';
import { NextResponse } from 'next/server';

// POST request body interface is not required in JavaScript
// GET request: Retrieve all orders
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                orderItems: true,
                customer: true,
            },
        });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST request: Create a new order
export async function POST(req) {
    const {
        name,
        email,
        address,
        city,
        zip,
        customerId,
        orderItems,
        total,
        paymentMethod,
    } = await req.json();

    // Validation: Ensure required fields are provided
    if (!name || !email || !address || !customerId || !orderItems || orderItems.length === 0) {
        return NextResponse.json({ error: 'Name, email, address, customerId, and orderItems are required.' }, { status: 400 });
    }

    try {
        const order = await prisma.order.create({
            data: {
                name,
                email,
                address,
                city,
                zip,
                customerId,
                total,
                paymentMethod,
                orderItems: {
                    create: orderItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
