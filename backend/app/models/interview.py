from pydantic import BaseModel


class InterviewMessage(BaseModel):
    session_id: str
    message: str