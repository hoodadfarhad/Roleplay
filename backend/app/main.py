from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.context import router as context_router
from app.routes.interview import router as interview_router

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


app.include_router(context_router)
app.include_router(interview_router)
