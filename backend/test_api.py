import urllib.request
import json
import traceback

BASE = "http://localhost:8000/api"

# Step 1: Start a session
print("1. Starting session...")
req1 = urllib.request.Request(
    f"{BASE}/interview/start",
    method="POST",
    headers={"Content-Type": "application/json"},
    data=json.dumps({"topic": "Python", "difficulty": "medium", "duration_minutes": 30, "focus_areas": []}).encode(),
)
with urllib.request.urlopen(req1) as res1:
    data1 = json.loads(res1.read())
session_id = data1["data"]["session_id"]
first_q_id = data1["data"]["first_question"]["id"]
print(f"   Session: {session_id}")
print(f"   First Q: {data1['data']['first_question']['text'][:60]}...")

# Step 2: Submit an answer
print("\n2. Submitting answer...")
answer = {
    "question_id": first_q_id,
    "transcript": "I would use a dictionary for constant time lookups and combine it with a linked list for maintaining order",
    "audio_metrics": {},
    "video_metrics": {},
}
req2 = urllib.request.Request(
    f"{BASE}/interview/{session_id}/answer",
    method="POST",
    headers={"Content-Type": "application/json"},
    data=json.dumps(answer).encode(),
)
try:
    with urllib.request.urlopen(req2) as res2:
        data2 = json.loads(res2.read())
    print(f"   Eval score: {data2['data'].get('evaluation', {}).get('score', 'N/A')}")
    print(f"   Next Q: {data2['data'].get('next_question', {}).get('text', 'N/A')[:60]}...")
except Exception as e:
    print(f"   Answer submission error: {e}")

# Step 3: Get analysis
print("\n3. Fetching analysis...")
try:
    req3 = urllib.request.Request(f"{BASE}/interview/{session_id}/analysis")
    with urllib.request.urlopen(req3) as res3:
        data3 = json.loads(res3.read())
    analysis = data3["data"]
    print(f"   Overall Score: {analysis['overall_score']}")
    print(f"   Confidence:    {analysis['confidence_score']}")
    print(f"   Communication: {analysis['communication_score']}")
    print(f"   Emotion:       {analysis['emotion_analysis']}")
    print(f"   Speech:        {analysis['speech_metrics']}")
    print(f"   Gesture:       {analysis['gesture_analysis']}")
    print(f"   Feedback:      {analysis['feedback'][:2]}")
    print(f"   Q-wise:        {len(analysis['question_wise_analysis'])} questions")
    print(f"   Transcripts:   {len(analysis['transcripts'])} entries")
    print("\n   SUCCESS!")
except Exception as e:
    print(f"   Analysis error: {e}")
    traceback.print_exc()
