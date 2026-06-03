import os
import uuid

from fastapi import FastAPI
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Message, Conversation

from openai import AzureOpenAI

app = FastAPI()

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-02-01",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")


@app.get("/")
def root():
    return {"message": "Azure OpenAI Chat Service Running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(request: dict):

    db: Session = SessionLocal()

    conversation_id = request["conversation_id"]
    user_message = request["message"]

    # Check if conversation exists
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )

    # Create conversation automatically if it doesn't exist
    if conversation is None:

        conversation = Conversation(
            id=conversation_id,
            user_id="test-user",
            title="New Chat"
        )

        db.add(conversation)
        db.commit()

    # Store user message
    user_record = Message(
        id=uuid.uuid4(),
        conversation_id=conversation_id,
        role="user",
        content=user_message
    )

    db.add(user_record)
    db.commit()

    # Call Azure OpenAI
    response = client.chat.completions.create(
        model=DEPLOYMENT,
        messages=[
            {
                "role": "user",
                "content": user_message
            }
        ]
    )

    assistant_reply = response.choices[0].message.content

    # Store assistant response
    assistant_record = Message(
        id=uuid.uuid4(),
        conversation_id=conversation_id,
        role="assistant",
        content=assistant_reply
    )

    db.add(assistant_record)
    db.commit()

    return {
        "conversation_id": conversation_id,
        "response": assistant_reply
    }
