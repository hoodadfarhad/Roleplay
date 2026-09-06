from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

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
    return {
    "status": "context received",
    "resume": resume.filename or "",
    "job_posting_url": job_posting_url,
}
