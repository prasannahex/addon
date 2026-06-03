import React, { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import PromptBox from "./components/PromptBox";

import "./App.css";

function App() {

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {

    try {

      const response = await axios.get("/conversations");

      setConversations(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const loadMessages = async (id) => {

    try {

      const response = await axios.get(
        `/conversation/${id}`
      );

      setConversationId(id);

      setMessages(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const newChat = () => {

    setConversationId(null);

    setMessages([]);

  };

  const sendMessage = async (message) => {

    try {

      let currentConversationId = conversationId;

      if (!currentConversationId) {

        currentConversationId = crypto.randomUUID();

        setConversationId(currentConversationId);

      }

      await axios.post(
        "/chat",
        {
          conversation_id: currentConversationId,
          message: message
        }
      );

      await loadMessages(currentConversationId);

      await loadConversations();

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <div className="app">

      <div className="header">
        GenAI - Chat Bot
      </div>

      <div className="body">

        <Sidebar
          conversations={conversations}
          onSelect={loadMessages}
          onNewChat={newChat}
        />

        <div className="chat-section">

          <ChatWindow
            messages={messages}
          />

          <PromptBox
            onSend={sendMessage}
          />

        </div>

      </div>

    </div>

  );
}

export default App;
