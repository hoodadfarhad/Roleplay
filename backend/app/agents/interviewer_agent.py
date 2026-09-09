from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.tools import tool
from dotenv import load_dotenv
from app.agents.interviewer_prompt import context_getter
from typing import Literal
from pydantic import BaseModel, Field
from app.sessions import SessionNotFoundError, state_updater, get_session

load_dotenv(override=True)

class InterviewResponse(BaseModel):
    question: str = Field(description="The next interview question.")
    question_topic: str = Field(
        description="The topic being evaluated by this question."
    )
    question_type: Literal["initial", "follow_up"] = Field(
        description="Whether this is the initial question for the topic or a follow-up question."
    )
  

def get_interview_state_tool(session_id: str):
    """Create a state tool whose session is fixed by the incoming request."""

    @tool
    def get_interview_state() -> dict[str, int | str]:
        """Return the current question_count, followup_count, and current_topic."""
        session = get_session(session_id)
        if session is None:
            raise SessionNotFoundError(session_id)
        return session["interview_state"]

    return get_interview_state

memory = MemorySaver()

async def interview_agent(
    session_id: str,
    message: str,
) -> str:

    context = context_getter(session_id)
    interviewer = create_agent(
    model="openai:gpt-5.4-mini",
    tools=[get_interview_state_tool(session_id)],
    system_prompt= context,
    checkpointer= memory,
    response_format= InterviewResponse,
    )
    config = {"configurable": {"thread_id": session_id}}


    result = await interviewer.ainvoke({"messages": [{"role": "user", "content": message}]}, config=config)

    state_updater(result["structured_response"].question_type, session_id, result["structured_response"].question_topic)

    return result["structured_response"].question
