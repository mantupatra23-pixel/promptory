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
            backgroundColor: '#0D1117',
            padding: '60px',
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
                  width: '20px',
                  height: '20px',
                  borderRadius: '10px',
                  backgroundColor: '#10B981',
                  marginRight: '14px',
                }}
              />
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '34px',
                  fontWeight: 800,
                }}
              >
                Promptory
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                color: '#6EE7B7',
                backgroundColor: '#064E3B',
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              Verified System Prompt
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: title.length > 50 ? '42px' : '52px',
                fontWeight: 900,
                color: '#F0F6FC',
                lineHeight: 1.25,
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom Badges & Domain */}
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
                  color: '#58A6FF',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 700,
                  marginRight: '12px',
                }}
              >
                🤖 {model}
              </div>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#161B22',
                  border: '1px solid #30363D',
                  color: '#7EE787',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                💼 {role}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                color: '#8B949E',
                fontSize: '22px',
                fontWeight: 600,
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
    return new Response(`OG image generation failed: ${e?.message}`, { status: 500 });
  }
}
