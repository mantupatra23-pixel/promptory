import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Production AI Prompt Engine';
    const model = searchParams.get('model') || 'All Frontier Models';
    const role = searchParams.get('role') || 'Engineering';
    const score = searchParams.get('score') || '98';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0A0D12',
            padding: '56px 64px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Subtle Ambient Neon Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-120px',
              right: '-120px',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(10,13,18,0) 70%)',
              display: 'flex',
            }}
          />

          {/* Top Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '20px',
                }}
              >
                P
              </div>
              <span style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                Promptory
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#34D399',
                fontSize: '15px',
                fontWeight: 700,
              }}
            >
              <span>Quality Score {score}/100</span>
            </div>
          </div>

          {/* Main Title & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '1020px', zIndex: 10 }}>
            <h1
              style={{
                fontSize: title.length > 55 ? '46px' : '56px',
                fontWeight: 800,
                color: '#F8FAFC',
                lineHeight: 1.15,
                letterSpacing: '-1.5px',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </h1>

            <p style={{ fontSize: '20px', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>
              Production-grade system prompt engineered with zero-hallucination boundary constraints and deterministic outputs.
            </p>
          </div>

          {/* Bottom Telemetry & Tags */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '28px',
              borderTop: '1px solid #1E293B',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#161B22',
                  border: '1px solid #30363D',
                  color: '#E2E8F0',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Model: {model}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#161B22',
                  border: '1px solid #30363D',
                  color: '#E2E8F0',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                Role: {role}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#64748B',
                fontSize: '14px',
                fontFamily: 'monospace',
              }}
            >
              <span style={{ color: '#34D399' }}>npx promptory-cli</span> &bull; promptory.xyz
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
    return new Response(`Failed to generate OG image: ${e.message}`, {
      status: 500,
    });
  }
}
