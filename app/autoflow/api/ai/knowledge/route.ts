import { NextRequest, NextResponse } from 'next/server';
import { addToKnowledgeBase, queryKnowledgeBase, sampleKnowledgeData } from '@/lib/knowledge-base';

// API route to list or seed the knowledge base with sample data
export async function GET(request: NextRequest) {
  try {    
    // Get the seed query parameter
    const url = new URL(request.url);
    const seed = url.searchParams.get('seed');
    
    if (seed === 'true') {
      // Add sample data to knowledge base
      const result = addToKnowledgeBase(sampleKnowledgeData);
      
      return NextResponse.json({
        success: true,
        message: `Successfully seeded knowledge base with ${result.count} items`
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Knowledge base API is active. Use ?seed=true to seed with sample data'
      });
    }
  } catch (error) {
    console.error('Knowledge base API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process request', error: String(error) },
      { status: 500 }
    );
  }
}

// API route to query the knowledge base
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Request body must be a JSON object' },
        { status: 400 }
      );
    }
    const { query, limit = 3 } = body;
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Query the knowledge base
    const result = queryKnowledgeBase(query, limit);
    
    return NextResponse.json({
      success: true,
      results: result.results
    });
  } catch (error) {
    console.error('Knowledge base query error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process query', error: String(error) },
      { status: 500 }
    );
  }
} 