import { Routes, Route } from "react-router-dom";

import ContextPage from "./pages/ContextPage";
import InterviewPage from "./pages/InterviewPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ContextPage />} />
      <Route path="/interview" element={<InterviewPage />} />
    </Routes>
  );
}

export default App;