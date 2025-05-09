// -----------------------------------------------------------------------------
//  <CommentChatbot/> – Right‑hand column with chat API, feedback buttons, and copy confirmation
// -----------------------------------------------------------------------------

import * as React from "react";
import {
  Card,
  Input,
  Button,
  makeStyles
} from "@fluentui/react-components";
import { ArrowRight20Regular } from "@fluentui/react-icons";
import { DataContext } from "../App";

const useStyles = makeStyles({
  root: { height: "100%" },
  chatContainer: {
    height: "300px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "0.75rem",
    gap: "0.5rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    fontSize: "14px",
    border: "1px solid #ddd",
    marginBottom: "0.75rem"
  },
  messageRow: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start"
  },
  messageText: {
    whiteSpace: "pre-wrap",
    maxWidth: "75%"
  },
  tools: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "0.25rem",
    fontSize: "0.8rem"
  },
  toolButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    color: "#0078D4",
    fontWeight: "500"
  }
});

export default function CommentChatbot() {
  const styles = useStyles();
  const { filters } = React.useContext(DataContext);

  const [chatInput, setChatInput] = React.useState("");
  const [conversation, setConversation] = React.useState([
    { role: "assistant", text: "Full comment text will appear here…" }
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [copiedIndex, setCopiedIndex] = React.useState(null);
  const chatEndRef = React.useRef(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isLoading]);

  const askBot = async () => {
    if (!chatInput.trim()) return;

    setConversation((prev) => [...prev, { role: "user", text: chatInput }]);
    setIsLoading(true);

    try {
      const result = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant answering questions about public comments on energy policy dockets."
            },
            {
              role: "user",
              content: `Docket: ${filters.docket}\nCommenter: ${filters.commenter}\nTopic: ${filters.topic}\nQuestion: ${chatInput}`
            }
          ]
        })
      });

      const json = await result.json();
      const reply = json.choices?.[0]?.message?.content ?? "No response received.";
      setConversation((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error(err);
      setConversation((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong." }
      ]);
    } finally {
      setIsLoading(false);
      setChatInput("");
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className={styles.root}>
      {/* Chat history */}
      <div className={styles.chatContainer}>
        {conversation.map((msg, i) => (
  <div
    key={i}
    className={styles.messageRow}
    style={i === 0 ? { padding: 0, margin: 0 } : {}}
  >
    <div
      style={
        i === 0
          ? {
              padding: 0,
              margin: 0,
              maxWidth: "100%",
              fontWeight: 500
            }
          : {}
      }
    >
      <div
        className={styles.messageText}
        style={i === 0 ? { padding: 0, margin: 0, maxWidth: "100%" } : {}}
      >
        <strong>{msg.role === "assistant" ? "Assistant" : "User"}:</strong>{" "}
        {msg.text}
      </div>

      {/* Tools only for assistant messages except the first */}
      {msg.role === "assistant" && i !== 0 && (
        <div className={styles.tools}>
          <button
            className={styles.toolButton}
            onClick={() => handleCopy(msg.text, i)}
          >
            {copiedIndex === i ? "✓ Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  </div>
))}

        {isLoading && (
          <div className={styles.messageRow}>
            <div className={styles.messageText}>
              <strong>Assistant:</strong> typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Input
          placeholder="Ask a question about this docket, topic, or summary…"
          value={chatInput}
          onChange={(_, v) => setChatInput(v.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              e.preventDefault();
              askBot();
            }
          }}
          disabled={isLoading}
          style={{ flexGrow: 1 }}
        />
        <Button
          appearance="primary"
          icon={<ArrowRight20Regular />}
          onClick={askBot}
          disabled={isLoading}
        />
      </div>
    </Card>
  );
}

