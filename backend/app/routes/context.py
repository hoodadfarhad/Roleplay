from fastapi import APIRouter, File, Form, UploadFile

from app.services.context_service import learn_context


router = APIRouter()


@router.post("/learn_context")
async def learn_context_route(
    resume: UploadFile = File(...),
    job_posting_url: str = Form(...),
) -> dict[str, str]:

    resume_bytes = await resume.read()

    session_id = await learn_context(
        resume_bytes=resume_bytes,
        job_posting_url=job_posting_url,
    )

    return {"session_id": session_id}