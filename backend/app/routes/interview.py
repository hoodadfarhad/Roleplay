from typing import Any

from fastapi import APIRouter, HTTPException, status

from app.models.interview import InterviewMessage
from app.services.interview_service import chat
from app.sessions import SessionNotFoundError
from app.agents.interviewer_agent import INTERVIEW_CLOSING_MESSAGE


router = APIRouter()


@router.post("/interview/chat")
async def interview_chat(
    data: InterviewMessage,
) -> dict[str, Any]:

    try:
        response, feedback = await chat(
            session_id=data.session_id,
            message=data.message,
        )
    except SessionNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found. Please start a new interview.",
        ) from None

    return {
        "message": response,
        "is_complete": response == INTERVIEW_CLOSING_MESSAGE,
        "feedback": feedback.model_dump() if feedback else None,
    }
