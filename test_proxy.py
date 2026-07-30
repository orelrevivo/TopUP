import requests
from flask import Flask, request, Response

app = Flask(__name__)

@app.route('/proxy')
def proxy():
    url = request.args.get('url')
    headers = {'User-Agent': 'Mozilla/5.0'}
    resp = requests.get(url, headers=headers)
    
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'x-frame-options', 'content-security-policy']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]
               
    return Response(resp.content, resp.status_code, headers)

if __name__ == '__main__':
    app.run(port=8080)
