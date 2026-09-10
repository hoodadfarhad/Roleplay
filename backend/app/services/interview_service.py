from app.agents.analyzer_agent import InterviewFeedback
from app.agents.interviewer_agent import interview_agent


async def chat(
    session_id: str,
    message: str,
) -> tuple[str, InterviewFeedback | None]:

    response = await interview_agent(
        session_id=session_id,
        message=message,
    )

    return response
