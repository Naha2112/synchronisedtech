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

    const { invoiceId, invoiceData } = await request.json();

    if (!invoiceData) {
      return NextResponse.json({ error: 'Invoice data required' }, { status: 400 });
    }

    // Get AI categorization
    const categorization = await AIService.categorizeInvoice(invoiceData);

    // Store AI analysis result if invoiceId provided
    if (invoiceId) {
      await prisma.aI_Analysis.create({
        data: {
          invoiceId: parseInt(invoiceId),
          type: 'CATEGORIZATION',
          result: JSON.stringify(categorization),
          confidence: categorization.confidence,
          createdAt: new Date(),
        },
      });

      // Update invoice with AI categories
      await prisma.invoices.update({
        where: { id: parseInt(invoiceId) },
        data: {
          category: categorization.category,
          subcategory: categorization.subcategory,
          tags: categorization.tags.join(','),
        },
      });
    }

    return NextResponse.json({
      success: true,
      categorization,
    });

  } catch (error) {
    console.error('AI Categorization API Error:', error);
    return NextResponse.json(
      { error: 'Failed to categorize invoice' },
      { status: 500 }
    );
  }
}

// Batch categorization endpoint
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoices } = await request.json();

    if (!invoices || !Array.isArray(invoices)) {
      return NextResponse.json({ error: 'Invoices array required' }, { status: 400 });
    }

    const requests = invoices.map((invoice: any) => ({
      type: 'categorization' as const,
      data: invoice.data,
      id: invoice.id.toString(),
    }));

    const results = await AIService.batchAnalyze(requests);

    // Store results in database
    const analysisRecords = [];
    for (const [invoiceId, categorization] of Object.entries(results)) {
      if (categorization) {
        analysisRecords.push({
          invoiceId: parseInt(invoiceId),
          type: 'CATEGORIZATION',
          result: JSON.stringify(categorization),
          confidence: (categorization as any).confidence,
          createdAt: new Date(),
        });
      }
    }

    if (analysisRecords.length > 0) {
      await prisma.aI_Analysis.createMany({
        data: analysisRecords,
      });
    }

    return NextResponse.json({
      success: true,
      results,
      processed: analysisRecords.length,
    });

  } catch (error) {
    console.error('Batch AI Categorization Error:', error);
    return NextResponse.json(
      { error: 'Failed to process batch categorization' },
      { status: 500 }
    );
  }
} 