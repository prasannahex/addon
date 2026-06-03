# ---------- Build React Frontend ----------

FROM node:20 AS frontend-build

WORKDIR /frontend

COPY genai-chatbot/frontend/package*.json ./

RUN npm install

COPY genai-chatbot/frontend/ .

RUN npm run build


# ---------- Build Python Backend ----------

FROM python:3.12-slim

WORKDIR /app

COPY genai-chatbot/backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY genai-chatbot/backend/ .

# Copy React build files
COPY --from=frontend-build /frontend/build ./static

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
