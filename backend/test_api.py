import urllib.request
import json
import traceback

print("Starting session...")
req1 = urllib.request.Request(
    'http://localhost:8000/api/interview/start',
    method='POST',
    headers={'Content-Type': 'application/json'},
    data=b'{"topic": "Python", "difficulty": "medium", "duration_minutes": 30, "focus_areas": []}'
)
try:
    with urllib.request.urlopen(req1) as res1:
        data1 = json.loads(res1.read())
        print(json.dumps(data1, indent=2))
except Exception as e:
    traceback.print_exc()
