from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from app.tools_context import extract_pdf_text, extract_job_description

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
    # TODO: create new session and return session id after learning context
    return {
    "status": "context received",
    "resume": resume.filename or "",
    "job_posting_url": job_posting_url,
}
