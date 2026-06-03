import React from "react";

function ChatWindow({ messages }) {

  return (
    <div className="chat-window">

      {
        messages.map((m, index) => (

          <div
            key={index}
            className={
              m.role === "user"
                ? "user-message"
                : "assistant-message"
            }
          >
            {m.content}
          </div>

        ))
      }

    </div>
  );
}

export default ChatWindow;
