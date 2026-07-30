import requests
from flask import Flask, request, Response
import re

app = Flask(__name__)

@app.route('/proxy')
def proxy():
    url = request.args.get('url')
    if not url:
        return "No url", 400
        
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    try:
        resp = requests.get(url, headers=headers, timeout=10)
    except Exception as e:
        return str(e), 500
        
    # Inject <base> tag
    content = resp.text
    base_tag = f'<base href="{url}">'
    if '<head>' in content:
        content = content.replace('<head>', f'<head>{base_tag}', 1)
    elif '<HEAD>' in content:
        content = content.replace('<HEAD>', f'<HEAD>{base_tag}', 1)
    else:
        content = base_tag + content
        
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection', 
                        'x-frame-options', 'content-security-policy', 'cross-origin-embedder-policy',
                        'cross-origin-opener-policy']
                        
    out_headers = []
    for name, value in resp.raw.headers.items():
        if name.lower() not in excluded_headers:
            out_headers.append((name, value))
            
    # Also add CORS just in case
    out_headers.append(('Access-Control-Allow-Origin', '*'))
            
    return Response(content, resp.status_code, out_headers)

if __name__ == '__main__':
    app.run(port=8082)
