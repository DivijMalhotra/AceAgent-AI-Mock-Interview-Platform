import asyncio
from app.services.agents.orchestrator import orchestrator
from app.models.schemas import SessionState, InterviewConfig, Difficulty
import traceback

async def main():
    config = InterviewConfig(topic="Python", difficulty=Difficulty.MEDIUM)
    session = SessionState(config=config)
    
    from app.core.config import settings
    print("API KEY:", settings.openai_api_key[:10] + "...")
    print("MODEL:", settings.openai_model)
    
    from app.services.agents.base import client
    try:
        res = await client.chat.completions.create(
            model=settings.openai_model,
            messages=[{"role": "user", "content": "say hi"}],
        )
        print("OPENAI RESP:", res)
    except Exception as e:
        print("OPENAI ERROR!")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
