import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Battle-Tested AI System Prompt';
    const model = searchParams.get('model') || 'ChatGPT';
    const role = searchParams.get('role') || 'Developer';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0A0E14',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                }}
              />
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '32px',
                  fontWeight: 'bold',
                }}
              >
                Promptory
              </span>
            </div>
            <div
              style={{
                color: '#6EE7B7',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              System Prompt & Workflow
            </div>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div
              style={{
                fontSize: title.length > 50 ? '46px' : '54px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
          </div>

          {/* Badges Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  color: '#E5E7EB',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                🤖 {model}
              </div>
              <div
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  color: '#E5E7EB',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                💼 {role}
              </div>
            </div>

            <div
              style={{
                color: '#9CA3AF',
                fontSize: '20px',
                fontWeight: 500,
              }}
            >
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
    return new Response(`OG generation error: ${e?.message}`, { status: 500 });
  }
}
