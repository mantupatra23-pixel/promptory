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
            position: 'relative',
            border: '2px solid #1F2937',
          }}
        >
          {/* Neon Green Glow Accent */}
          <div
            style={{
              position: 'absolute',
              top: '-120px',
              right: '-120px',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(10, 14, 20, 0) 70%)',
            }}
          />

          {/* Header Branding */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 15px #10B981',
                }}
              />
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '32px',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                }}
              >
                Promptory
              </span>
            </div>
            <span
              style={{
                color: '#6EE7B7',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              System Prompt & Workflow
            </span>
          </div>

          {/* Main Title Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '1000px' }}>
            <h1
              style={{
                fontSize: title.length > 50 ? '48px' : '56px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.2,
                letterSpacing: '-1px',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer Metadata Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  color: '#E5E7EB',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
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
                  fontWeight: 600,
                  textTransform: 'capitalize',
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
    return new Response('Failed to generate dynamic OG Image', { status: 500 });
  }
}
