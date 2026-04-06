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
        session_id = data1['data']['session_id']
        question_id = data1['data']['first_question']['id']
        print(f"Session started: {session_id}")
        
        print("Submitting answer...")
        answer_data = {
            "question_id": question_id,
            "transcript": "This is a test transcript.",
            "audio_metrics": {},
            "video_metrics": {}
        }
        
        req2 = urllib.request.Request(
            f'http://localhost:8000/api/interview/{session_id}/answer',
            method='POST',
            headers={'Content-Type': 'application/json'},
            data=json.dumps(answer_data).encode('utf-8')
        )
        
        with urllib.request.urlopen(req2) as res2:
            data2 = json.loads(res2.read())
            print("Answer submitted successfully:")
            print(data2)
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code} {e.reason}")
    print(e.read().decode('utf-8'))
except Exception as e:
    traceback.print_exc()
