import React from "react";

function Sidebar({
  conversations,
  onSelect,
  onNewChat
}) {

  return (

    <div className="sidebar">

      <div
        className="new-chat-btn"
        onClick={onNewChat}
      >
        + New Chat
      </div>

      <h3>Chat History</h3>

      {
        conversations.map(c => (

          <div
            key={c.id}
            className="chat-item"
            onClick={() => onSelect(c.id)}
          >
            {c.title}
          </div>

        ))
      }

    </div>

  );
}

export default Sidebar;
