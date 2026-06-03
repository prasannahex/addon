class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(String)
    title = Column(String)
    created_at = Column(TIMESTAMP)
