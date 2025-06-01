import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AIService from '@/lib/ai/openai';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    // Get client data from database
    const client = await prisma.clients.findUnique({
      where: { id: parseInt(clientId) },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Prepare data for AI analysis
    const clientData = {
      name: client.name,
      lastInteraction: client.lastContactDate || client.createdAt,
      invoiceStatus: client.invoices[0]?.status || 'none',
      paymentHistory: client.paymentRating || 'new',
      communicationHistory: client.notes ? [client.notes] : [],
      outstandingAmount: client.invoices
        .filter((inv: any) => inv.status === 'pending')
        .reduce((total: number, inv: any) => total + (inv.total || 0), 0),
    };

    // Get AI suggestion
    const suggestion = await AIService.generateFollowUpSuggestions(clientData);

    // Store AI analysis result
    const analysis = await prisma.client_AI_Analysis.create({
      data: {
        clientId: parseInt(clientId),
        type: 'FOLLOWUP',
        result: JSON.stringify(suggestion),
        confidence: suggestion.confidence,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      suggestion,
      analysisId: analysis.id,
    });

  } catch (error) {
    console.error('AI Follow-up API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate follow-up suggestions' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all clients that need follow-up attention
    const clients = await prisma.clients.findMany({
      include: {
        invoices: {
          where: { status: 'pending' },
          orderBy: { dueDate: 'asc' },
        },
        _count: {
          select: { invoices: true },
        },
      },
    });

    // Filter clients that need attention
    const clientsNeedingAttention = clients.filter(client => {
      const overdueDays = client.invoices.some((invoice: any) => {
        const dueDate = new Date(invoice.dueDate);
        return dueDate < new Date();
      });
      
      const lastContact = client.lastContactDate || client.createdAt;
      const daysSinceContact = Math.floor(
        (Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24)
      );

      return overdueDays || daysSinceContact > 7;
    });

    return NextResponse.json({
      success: true,
      clientsNeedingAttention: clientsNeedingAttention.length,
      clients: clientsNeedingAttention.slice(0, 10), // Top 10 priority
    });

  } catch (error) {
    console.error('AI Follow-up List Error:', error);
    return NextResponse.json(
      { error: 'Failed to get follow-up list' },
      { status: 500 }
    );
  }
} 