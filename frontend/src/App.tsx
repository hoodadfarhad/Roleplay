import { Routes, Route } from "react-router-dom";

import ContextPage from "./pages/ContextPage";
import FeedbackPage from "./pages/FeedbackPage";
import InterviewPage from "./pages/InterviewPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ContextPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
    </Routes>
  );
}

export default App;
