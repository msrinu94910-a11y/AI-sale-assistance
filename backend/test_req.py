import urllib.request
import json

req = urllib.request.Request('http://127.0.0.1:8000/api/v1/bot/chat',
                              data=b'{"message": "18th sep 2026, 10 am"}',
                              headers={'Content-Type': 'application/json'})
print(json.loads(urllib.request.urlopen(req).read()))
