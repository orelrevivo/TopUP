import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    let content = await response.text();
    const baseTag = `<base href="${targetUrl}">`;
    if (content.toLowerCase().includes('<head>')) {
      content = content.replace(/(<head[^>]*>)/i, `$1\n${baseTag}`);
    } else {
      content = baseTag + content;
    }

    const headers = new Headers();
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (![
        'content-encoding', 'content-length', 'transfer-encoding', 'connection',
        'x-frame-options', 'content-security-policy', 'cross-origin-embedder-policy',
        'cross-origin-opener-policy'
      ].includes(lowerKey)) {
        headers.set(key, value);
      }
    });

    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
    headers.set('Content-Type', response.headers.get('content-type') || 'text/html');

    return new NextResponse(content, {
      status: response.status,
      headers,
    });
  } catch (error: any) {
    return new NextResponse(`Proxy error: ${error.message}`, { status: 500 });
  }
}
