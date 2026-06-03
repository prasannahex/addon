import React, { useState } from "react";

function PromptBox({ onSend }) {

  const [message, setMessage] = useState("");

  const send = () => {

    if (!message.trim()) {
      return;
    }

    onSend(message);

    setMessage("");

  };

  return (

    <div className="prompt-box">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            send();
          }
        }}
      />

      <button onClick={send}>
        Send
      </button>

    </div>

  );
}

export default PromptBox;
