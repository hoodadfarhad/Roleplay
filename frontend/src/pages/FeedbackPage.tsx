import { useNavigate } from "react-router-dom";
import "./FeedbackPage.css";

function FeedbackPage() {
  const navigate = useNavigate();

  return (
    <main className="feedback-page">
      <section className="feedback-card">
        <div className="feedback-icon">✓</div>
        <p className="feedback-eyebrow">INTERVIEW COMPLETE</p>
        <h1>Thanks for practicing with us.</h1>
        <p>
          Your interview is complete. Detailed feedback will appear here soon.
        </p>
        <button type="button" onClick={() => navigate("/")}>
          Start another interview
        </button>
      </section>
    </main>
  );
}

export default FeedbackPage;
