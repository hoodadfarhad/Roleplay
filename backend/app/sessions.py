import uuid
from typing import Dict, Any

sessions: Dict[str, Dict[str, Any]] = {}


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
    }
    print(sessions)
    return session_id


def get_session(session_id: str) -> Dict[str, Any] | None:
    """
    Retrieve an existing interview session.
    """

    return sessions.get(session_id)


def delete_session(session_id: str) -> None:
    """
    Delete an interview session.
    """

    sessions.pop(session_id, None)