import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Production AI System Prompt';
  const model = searchParams.get('model') || 'ChatGPT';
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
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          border: '8px solid #10b98120',
        }}
      >
        {/* TOP BRAND & BADGES */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#10b98120',
                border: '1px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              &gt;_
            </div>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#f4f4f5' }}>
              Prompt<span style={{ color: '#10b981' }}>ory</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: '#10b98115',
                border: '1px solid #10b98140',
                color: '#10b981',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {model}
            </div>
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: '#27272a',
                color: '#e4e4e7',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Score: {score}/100
            </div>
          </div>
        </div>

        {/* PROMPT TITLE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '18px', color: '#10b981', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
            Verified System Prompt
          </span>
          <div
            style={{
              fontSize: '46px',
              fontWeight: '900',
              color: '#fafafa',
              lineHeight: '1.2',
              letterSpacing: '-1px',
            }}
          >
            {title}
          </div>
        </div>

        {/* BOTTOM METADATA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #27272a',
            paddingTop: '24px',
            color: '#71717a',
            fontSize: '18px',
          }}
        >
          <span>Battle-tested prompt template & live variable generator</span>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>www.promptory.xyz</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
