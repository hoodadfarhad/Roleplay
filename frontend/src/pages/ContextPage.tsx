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

  const handleStartInterview = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
  
    if (!canStartInterview) {
      return;
    }
  
    try {
      const formData = new FormData();
  
      formData.append("resume", resumeFile);
      formData.append("job_posting_url", jobUrl);
  
      const response = await fetch("http://localhost:8000/learn_context", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to start interview");
      }
  
      const data = await response.json();
  
      console.log("Backend response:", data);
  
      navigate("/interview");
    } catch (error) {
      console.error("Error starting interview:", error);
    }
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