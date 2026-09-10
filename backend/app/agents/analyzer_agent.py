from typing import Any

from langchain.agents import create_agent
from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv(override=True)


class InterviewFeedback(BaseModel):
    score: int = Field(ge=0, le=100, description="Overall interview score out of 100.")
    what_went_well: str = Field(
        description="Exactly two sentences describing what the candidate did well."
    )
    improvements: list[str] = Field(
        min_length=3,
        max_length=3,
        description="Exactly three specific, actionable improvements.",
    )


async def analyzer_agent(messages: list[Any]) -> InterviewFeedback:
    """Analyze an interview transcript and return structured candidate feedback."""
    transcript = "\n\n".join(
        f"{message.type.upper()}: {message.content}"
        for message in messages
    )

    analyzer = create_agent(
        model="openai:gpt-5.4-nano",
        tools=[],
        system_prompt=(
            "You are an expert interview coach. Assess only the candidate's answers "
            "in the provided interview transcript. Be constructive, specific, and fair. "
            "Give an overall score from 0 to 100. Write exactly two sentences about "
            "what went well, covering both communication and technical performance when "
            "the transcript supports them. Then provide exactly three actionable feedback "
            "items for improvement. Do not invent information that is not in the transcript."
        ),
        response_format=InterviewFeedback,
    )
    

    result = await analyzer.ainvoke(
        {"messages": [{"role": "user", "content": transcript}]}
    )

    return result["structured_response"]
