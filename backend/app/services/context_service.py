from app.tools_context import extract_pdf_text, extract_job_description
from app.sessions import create_session


async def learn_context(
    resume_bytes: bytes,
    job_posting_url: str,
) -> str:

    resume_text = extract_pdf_text(resume_bytes)

    job_description_text = await extract_job_description(
        job_posting_url
    )

    session_id = create_session(
        resume_text,
        job_description_text,
    )

    return session_id


