import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Battle-Tested AI System Prompt';
    const model = searchParams.get('model') || 'ChatGPT';
    const role = searchParams.get('role') || 'Developer';
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
            backgroundColor: '#0A0E14',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            border: '8px solid #10B981',
          }}
        >
          {/* Top Bar Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '11px',
                  backgroundColor: '#10B981',
                  marginRight: '14px',
                }}
              />
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '36px',
                  fontWeight: 900,
                  letterSpacing: '-1px',
                }}
              >
                Promptory
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  color: '#10B981',
                  backgroundColor: '#064E3B',
                  border: '1px solid #10B981',
                  padding: '8px 20px',
                  borderRadius: '24px',
                  fontSize: '18px',
                  fontWeight: 800,
                  marginRight: '12px',
                }}
              >
                ★ Score {score}/100
              </div>
              <div
                style={{
                  display: 'flex',
                  color: '#E5E7EB',
                  backgroundColor: '#161B22',
                  border: '1px solid #30363D',
                  padding: '8px 18px',
                  borderRadius: '24px',
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                Verified AI Prompt
              </div>
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              margin: '20px 0',
            }}
          >
            <div
              style={{
                fontSize: title.length > 45 ? '46px' : '58px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.2,
                letterSpacing: '-1.5px',
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom Badges & Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#161B22',
                  border: '1px solid #30363D',
                  color: '#38BDF8',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontSize: '20px',
                  fontWeight: 800,
                  marginRight: '14px',
                }}
              >
                🤖 {model}
              </div>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#161B22',
                  border: '1px solid #30363D',
                  color: '#34D399',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontSize: '20px',
                  fontWeight: 800,
                }}
              >
                💼 {role}
              </div>
            </div>

            <div
              style={{
                color: '#9CA3AF',
                fontSize: '24px',
                fontWeight: 700,
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
    return new Response(`OG error: ${e?.message}`, { status: 500 });
  }
}
