import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import "./InterviewPage.css";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

const InterviewPage = () => {
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  const handleStartInterview = () => {
    setStarted(true);

    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content:
          "Hi! I'm your AI interviewer. Let's get started. Tell me a little bit about yourself and your background.",
      },
    ]);
  };

  /*
   * Send a text response.
   *
   * For now we only store the conversation locally.
   *
   * Later this function can:
   *
   * POST /interview/chat
   *
   * {
   *   session_id,
   *   message,
   *   history
   * }
   */
  const handleSendMessage = (event?: FormEvent) => {
    event?.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmedInput,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");

    /*
     * Temporary mock response.
     *
     * Replace this with your FastAPI call later.
     */
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Thanks. That's helpful. Can you tell me about a challenging technical problem you've worked on and how you approached solving it?",
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    }, 700);
  };


  const toggleVoiceInput = () => {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: any;
      webkitSpeechRecognition?: any;
    };
    const SpeechRecognition =
      speechWindow.SpeechRecognition ||
      speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported by this browser."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  /*
   * Press Enter to send.
   *
   * Shift + Enter creates a new line.
   */
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSendMessage();
    }
  };


  if (!started) {
    return (
      <main className="interview-page interview-start">
        <div className="interview-start-card">
          <div className="interview-icon">
            ✦
          </div>

          <h1>Ready for your mock interview?</h1>

          <p>
            I'll act as your interviewer and ask
            questions based on your background and
            the job you're applying for.
          </p>

          <div className="interview-tips">
            <div>
              <span>💬</span>
              <p>Answer naturally</p>
            </div>

            <div>
              <span>🎤</span>
              <p>Speak or type your answers</p>
            </div>

            <div>
              <span>🎯</span>
              <p>Treat it like a real interview</p>
            </div>
          </div>

          <button
            className="start-button"
            onClick={handleStartInterview}
          >
            Start the mock
            <span>→</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="interview-page">
      <div className="interview-container">

        {/* Header */}
        <header className="interview-header">
          <div>
            <div className="interviewer-status">
              <span className="status-dot" />
              AI Interviewer
            </div>

            <h1>Mock Interview</h1>
          </div>

          <div className="question-progress">
            Question {Math.max(messages.length, 1)}
          </div>
        </header>

        {/* Chat */}
        <section className="chat-container">
          <div className="messages">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-row ${message.role}`}
              >
                {message.role === "assistant" && (
                  <div className="avatar assistant-avatar">
                    ✦
                  </div>
                )}

                <div className="message-content">
                  <div className="message-name">
                    {message.role === "assistant"
                      ? "AI Interviewer"
                      : "You"}
                  </div>

                  <div className="message-bubble">
                    {message.content}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="avatar user-avatar">
                    You
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </section>

        {/* Input */}
        <form
          className="chat-input-container"
          onSubmit={handleSendMessage}
        >
          <textarea
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "Listening..."
                : "Type your answer..."
            }
            rows={1}
          />

          <button
            type="button"
            className={`voice-button ${
              isListening ? "listening" : ""
            }`}
            onClick={toggleVoiceInput}
            aria-label={
              isListening
                ? "Stop recording"
                : "Start voice input"
            }
          >
            {isListening ? "■" : "🎤"}
          </button>

          <button
            type="submit"
            className="send-button"
            disabled={!input.trim()}
            aria-label="Send message"
          >
            ↑
          </button>
        </form>

        <p className="input-hint">
          Press Enter to send · Shift + Enter for a
          new line
        </p>
      </div>
    </main>
  );
};

export default InterviewPage;
