from app.agents.interviewer_agent import interview_agent


async def chat(
    session_id: str,
    message: str,
) -> str:

    response = await interview_agent(
        session_id=session_id,
        message=message,
    )

    return response