import React, { useState } from "react";

function PromptBox({ onSend }) {

  const [message, setMessage] = useState("");

  return (

    <div className="prompt-box">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
      />

      <button
        onClick={() => {

          onSend(message);

          setMessage("");

        }}
      >
        Send
      </button>

    </div>

  );
}

export default PromptBox;
