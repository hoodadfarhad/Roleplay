from fastapi import APIRouter, HTTPException, status

from app.models.interview import InterviewMessage
from app.services.interview_service import chat
from app.sessions import SessionNotFoundError


router = APIRouter()


@router.post("/interview/chat")
async def interview_chat(
    data: InterviewMessage,
) -> dict[str, str]:

    try:
        response = await chat(
            session_id=data.session_id,
            message=data.message,
        )
    except SessionNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found. Please start a new interview.",
        ) from None

    return {"message": response}
