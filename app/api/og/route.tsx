import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Accept both parameter styles from prompts & workflows
    const title = searchParams.get('title') || 'Production AI System Prompt & Workflow Blueprint';
    const model = searchParams.get('model') || 'Frontier Models';
    const category = searchParams.get('category') || searchParams.get('task') || model;
    const targetRole = searchParams.get('role') || searchParams.get('profession') || 'Software Engineer';
    const score = searchParams.get('score') || searchParams.get('quality_score') || '99';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#07090e',
            padding: '60px 80px',
            fontFamily: 'sans-serif',
            color: '#f3f4f6',
            border: '8px solid #0f172a',
          }}
        >
          {/* Header Brand Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontSize: '26px',
                  fontWeight: 900,
                }}
              >
                P
              </div>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff' }}>
                Prompt<span style={{ color: '#10b981' }}>ory</span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  fontSize: '18px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {category}
              </div>

              <div
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                {score}/100 Score
              </div>
            </div>
          </div>

          {/* Main Title & Role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1020px' }}>
            <div
              style={{
                fontSize: '20px',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: 600,
              }}
            >
              Target: {targetRole}
            </div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#ffffff',
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer Feature Callouts */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #1f2937',
              paddingTop: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '18px' }}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● Deterministic Boundaries</span>
              <span style={{ color: '#9ca3af' }}>• Multi-Step Chaining</span>
              <span style={{ color: '#9ca3af' }}>• Zero Hallucinations</span>
            </div>

            <div style={{ fontSize: '22px', color: '#6b7280', fontFamily: 'monospace' }}>
              promptory.xyz
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed: ${e.message}`, { status: 500 });
  }
}
