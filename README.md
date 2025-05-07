# AI-Powered Helpdesk Form Assistant (Next.js + Gemini)

This project is a containerized web application built with **Next.js** (both frontend and backend) that uses **Google's Gemini LLM** to help users fill out a helpdesk form via a conversational interface.

The assistant engages in a chat with the user, intelligently asks follow-up questions, and progressively completes a structured helpdesk form. Once completed, the form is saved as a JSON file to disk.

---

## 💡 Features

- Conversational UI using Gemini LLM (free API)
- Smart assistant-driven form filling
- Users can ask for current state of the form at any time
- Form fields:
    - `Firstname` (string, max 20 characters)
    - `Lastname` (string, max 20 characters)
    - `Email` (validated format)
    - `Reason of contact` (string, max 100 characters)
    - `Urgency` (integer, range 1–10)
- Final form data is saved as a `.json` file
- Containerized with Docker for easy deployment

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jakubzajkowski/freeport.git
cd freeport
```

### 1. Set up your API key

Create a `.env` file in the root directory with the following content:

```ini
NEXT_PUBLIC_API_KEY_GEMINI=your_api_key_here
```
---

## 🐳 Running with Docker

### ✅ Build the Docker image

```bash
docker build -t next-dev .
```

### ▶️ Run the container

💻 For macOS / Linux:

```bash
docker run -p 3000:3000 -v $(pwd)/data:/app/data next-dev
```
🪟 For Windows (PowerShell):

```bash
docker run -p 3000:3000 -v "${PWD}\data:/app/data" next-dev
```

This mounts the ./data folder to the container so that all submitted JSON files are saved persistently.

