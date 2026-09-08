from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from app.tools_context import extract_pdf_text, extract_job_description
from app.sessions import create_session

app = FastAPI(title="RolePlay")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/learn_context")
async def learn_context(
    resume: UploadFile = File(...),
    job_posting_url: str = Form(...),
) -> dict[str, str]:

    resume_bytes = await resume.read()
    resume_text = extract_pdf_text(resume_bytes)

    job_description_text = await extract_job_description(job_posting_url)

    print(resume_text)
    print("--------------------------------")
    print(job_description_text)
    print("--------------------------------")
    session_id = create_session(resume_text, job_description_text)  
    return {"session_id": session_id}


@app.post("/interview/chat")
async def interview_chat(
    data: dict[str, str],
) -> dict[str, str]:
    session_id = data["session_id"]
    message = data["message"]
    return {"message": "Hello, world! from session " + session_id + " with message " + message } 