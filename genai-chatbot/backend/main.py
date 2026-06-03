import os
import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from database import SessionLocal
from models import Message, Conversation

from openai import AzureOpenAI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-12-01-preview",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/conversations")
def get_conversations():

    db = SessionLocal()

    conversations = db.query(Conversation).all()

    return [
        {
            "id": str(c.id),
            "title": c.title
        }
        for c in conversations
    ]


@app.get("/conversation/{conversation_id}")
def get_conversation(conversation_id: str):

    db = SessionLocal()

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .all()
    )

    return [
        {
            "role": m.role,
            "content": m.content
        }
        for m in messages
    ]


@app.post("/chat")
def chat(request: dict):

    db: Session = SessionLocal()

    conversation_id = request["conversation_id"]
    user_message = request["message"]

    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )

    if conversation is None:

        conversation = Conversation(
            id=conversation_id,
            user_id="user1",
            title=user_message[:50]
        )

        db.add(conversation)
        db.commit()

    user_record = Message(
        id=uuid.uuid4(),
        conversation_id=conversation_id,
        role="user",
        content=user_message
    )

    db.add(user_record)
    db.commit()

    history = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .all()
    )

    chat_messages = []

    for msg in history:
        chat_messages.append(
            {
                "role": msg.role,
                "content": msg.content
            }
        )

    response = client.chat.completions.create(
        model=DEPLOYMENT,
        messages=chat_messages
    )

    answer = response.choices[0].message.content

    assistant_record = Message(
        id=uuid.uuid4(),
        conversation_id=conversation_id,
        role="assistant",
        content=answer
    )

    db.add(assistant_record)
    db.commit()

    return {
        "response": answer
    }
