import uuid
from typing import Dict, Any
from typing import TypedDict

sessions: Dict[str, Dict[str, Any]] = {}

class InterviewState(TypedDict):
    question_count: int
    followup_count: int
    current_topic: str

interview_state: InterviewState = {

    "question_count": 1,
    "followup_count": 0,
    "current_topic": "",
}


class SessionNotFoundError(Exception):
    """Raised when a request refers to an interview session that no longer exists."""


def create_session(
    resume_text: str,
    job_description: str,
) -> str:
    """
    Create a new temporary interview session.
    """

    session_id = str(uuid.uuid4())

    sessions[session_id] = {
        "resume": resume_text,
        "job_description": job_description,
        "interview_state": interview_state.copy(),
    }
    
    return session_id


def get_session(session_id: str) -> Dict[str, Any] | None:
    """
    Retrieve an existing interview session.
    """

    return sessions.get(session_id)

def state_updater(question_type: str, session_id: str, topic: str | None = None,):
    session = get_session(session_id)
    print(session["interview_state"])
    if session is None:
        raise SessionNotFoundError(session_id)

    state = session["interview_state"]
    state["question_count"] += 1
    if question_type == "follow_up":
        state["followup_count"] += 1

    else:
        state["followup_count"] = 0
        state["current_topic"] = topic

def delete_session(session_id: str) -> None:
    """
    Delete an interview session.
    """

    sessions.pop(session_id, None)
