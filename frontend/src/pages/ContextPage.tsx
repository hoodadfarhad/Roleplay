import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./ContextPage.css";

function ContextPage() {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [error, setError] = useState("");

  const canStartInterview =
    resumeFile !== null && jobUrl.trim().length > 0;

  const handleResumeChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setResumeFile(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setResumeFile(null);
      setError("Please upload a PDF file.");
      event.target.value = "";
      return;
    }

    setError("");
    setResumeFile(file);
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
  };

  const handleStartInterview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canStartInterview) {
      return;
    }

    // Backend integration will go here later.
    // 1. Upload resume
    // 2. Send job posting URL
    // 3. Receive interview/session ID
    // 4. Navigate to interview

    navigate("/interview");
  };

  return (
      <main className="context-page">
        <section className="context-page__container">
          <header className="context-page__header">
            <p className="context-page__eyebrow">
              AI-POWERED INTERVIEW PREP
            </p>
    
            <h1>Practice for your next interview.</h1>
    
            <p className="context-page__description">
              Upload your resume and provide a job posting. We'll create a
              personalized mock interview based on your experience and the role
              you're applying for.
            </p>
          </header>
    
          <form
            className="context-page__form"
            onSubmit={handleStartInterview}
          >
            <div className="context-page__field">
              <label htmlFor="resume">Upload your resume</label>
    
              <p className="context-page__hint">PDF format only</p>
    
              {!resumeFile ? (
                <input
                  id="resume"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleResumeChange}
                />
              ) : (
                <div className="context-page__selected-file">
                  <span>📄 {resumeFile.name}</span>
    
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
    
            <div className="context-page__field">
              <label htmlFor="job-url">Job posting</label>
    
              <p className="context-page__hint">
                Paste the URL of the job you're preparing for.
              </p>
    
              <textarea
                id="job-url"
                value={jobUrl}
                onChange={(event) => setJobUrl(event.target.value)}
                placeholder="https://..."
                rows={3}
              />
            </div>
    
            {error && (
              <p className="context-page__error">{error}</p>
            )}
    
            <button
              className="context-page__submit"
              type="submit"
              disabled={!canStartInterview}
            >
              Start Mock Interview →
            </button>
          </form>
        </section>
      </main>
  );
}

export default ContextPage;