import { NextResponse } from 'next/server';
import { withSecurity } from '~/lib/security';
import { requireUser, handleAuthError } from '~/lib/auth/auth-helpers';
import dns from 'dns';
import { isIP } from 'net';

function isPrivateIP(ip: string): boolean {
  if (ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('169.254.') || ip === '0.0.0.0') {
    return true;
  }
  if (ip.startsWith('172.')) {
    const parts = ip.split('.');
    const second = parseInt(parts[1], 10);
    if (second >= 16 && second <= 31) return true;
  }
  if (ip.startsWith('192.168.')) {
    return true;
  }
  if (ip === '::1' || ip === '::' || ip.toLowerCase().startsWith('fe80:') || ip.toLowerCase().startsWith('fc00:') || ip.toLowerCase().startsWith('fd00:')) {
    return true;
  }
  return false;
}

async function validateTargetUrl(urlStr: string): Promise<boolean> {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'https:') return false;

    const hostname = parsed.hostname;
    if (isIP(hostname)) {
      return !isPrivateIP(hostname);
    }

    // Resolve host to IP
    const ipAddresses = await new Promise<string[]>((resolve) => {
      dns.lookup(hostname, { all: true }, (err, addresses) => {
        if (err || !addresses) resolve([]);
        else resolve(addresses.map((a) => a.address));
      });
    });

    if (ipAddresses.length === 0) return false;
    return ipAddresses.every((ip) => !isPrivateIP(ip));
  } catch {
    return false;
  }
}

const proxyGet = withSecurity(async ({ request }) => {
  try {
    // 1. Enforce authentication
    await requireUser();

    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }

    // 2. Validate URL (HTTPS and public IP only)
    const isValid = await validateTargetUrl(targetUrl);
    if (!isValid) {
      return new NextResponse('Invalid or forbidden URL', { status: 400 });
    }

    // 3. Fetch with SSRF protections (manual redirect checking, timeout)
    let currentUrl = targetUrl;
    let redirectCount = 0;
    let response: Response | null = null;

    while (redirectCount < 3) {
      response = await fetch(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        redirect: 'manual',
        signal: AbortSignal.timeout(5000), // 5 seconds timeout
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location) break;

        const resolvedLocation = new URL(location, currentUrl).toString();
        const isValidRedirect = await validateTargetUrl(resolvedLocation);
        if (!isValidRedirect) {
          return new NextResponse('Forbidden redirect URL', { status: 400 });
        }

        currentUrl = resolvedLocation;
        redirectCount++;
      } else {
        break;
      }
    }

    if (!response) {
      return new NextResponse('Failed to fetch target', { status: 500 });
    }

    // 4. Response size limit check (max 5MB)
    const contentLengthStr = response.headers.get('content-length');
    if (contentLengthStr) {
      const contentLength = parseInt(contentLengthStr, 10);
      if (contentLength > 5 * 1024 * 1024) {
        return new NextResponse('Response size limit exceeded (Max 5MB)', { status: 413 });
      }
    }

    let content = await response.text();
    // Double check size of content string
    if (content.length > 5 * 1024 * 1024) {
      return new NextResponse('Response size limit exceeded (Max 5MB)', { status: 413 });
    }

    const baseTag = `<base href="${currentUrl}">`;
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
    if ((error as any).status) return handleAuthError(error);
    return new NextResponse(`Proxy error: ${error.message}`, { status: 500 });
  }
});

export async function GET(request: Request) {
  return proxyGet({ request, context: { env: process.env as any } });
}

