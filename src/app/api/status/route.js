import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const statusChecks = await prisma.statusCheck.findMany({
            orderBy: { timestamp: 'desc' },
        });
        return NextResponse.json(statusChecks);
    } catch (error) {
        console.error('Error fetching status checks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { client_name } = await request.json();
        if (!client_name) {
            return NextResponse.json({ error: 'client_name is required' }, { status: 400 });
        }
        const statusCheck = await prisma.statusCheck.create({
            data: { client_name },
        });
        return NextResponse.json(statusCheck);
    } catch (error) {
        console.error('Error creating status check:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
