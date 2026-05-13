# NewsAI: Advanced RAG News Chatbot

NewsAI is a professional-grade Retrieval-Augmented Generation (RAG) chatbot designed to provide accurate, source-backed news insights. It features a deep-dive AI analysis sidebar, mobile-responsive design, and a modern, high-end interface.

## 🚀 Features

- **RAG-Powered Chat**: Ask questions about news and get answers backed by real articles.
- **AI Analysis Sidebar**: Deep-dive into any news response with specialized AI insights (Gemini 2.5 Flash).
- **Source Transparency**: Each AI response includes clickable source cards with headlines, categories, and direct links.
- **Contextual Memory**: Maintains separate analysis histories for every news story discussed.
- **Premium UI/UX**: 
  - Dark/Light mode support.
  - Mobile-responsive sidebar and navigation.
  - Lucide icons & smooth CSS animations.
  - Markdown rendering for rich AI responses.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Lucide React (Icons)
- React Markdown
- Centralized API Service

**Backend:**
- Node.js & Express
- MongoDB (Session Management)
- Qdrant (Vector Database for RAG)
- OpenAI (GPT-4o Mini & Embeddings)
- Google Gemini (Analysis Service)

---

## ⚙️ Project Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Qdrant Cloud account (or local Qdrant)
- OpenAI & Google Gemini API Keys

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:8080/api
```

---

## 📂 Data Ingestion

To populate your news database, ensure you have your data in `backend/src/data/news.json` and run the ingestion endpoint:

1. Start the backend: `npm run dev`
2. Send a POST request to: `http://localhost:8080/api/ingest` (You can use Postman or curl).

**Option B: Via Direct Script (Recommended for initial setup)**
If you don't want to use the API, you can run the ingestion script directly from your terminal:
```bash
cd backend
npm run ingest
```

---

## 🏃‍♂️ Running the Application

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🐳 Docker Setup

If you want to run the necessary services (like Qdrant) using Docker, a configuration is provided in the `backend` directory.

### Run Qdrant with Docker
```bash
cd backend
docker-compose up -d
```
This will start a local Qdrant instance at `http://localhost:6333`. Update your backend `.env` accordingly:
```env
QDRANT_URL=http://localhost:6333
```

---

## 📜 API Endpoints

- **Chat**: `POST /api/chat` - Interact with the news bot.
- **Sessions**: `GET /api/chat/sessions` - Retrieve chat history list.
- **Messages**: `GET /api/chat/:id` - Fetch messages for a specific session.
- **Analysis**: `POST /api/analyze` - Trigger the deep AI analysis sidebar.
- **Ingest**: `POST /api/ingest` - Process and store news chunks in Qdrant.

---


