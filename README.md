# Neural Research Sentinel

Advanced AI Hallucination & Fabrication Detection Dashboard.

## Setup Instructions

1. Ensure you have [Docker](https://www.docker.com/) and Docker Compose installed.
2. In the root directory, configure your environment variables:
   Create a `.env` file containing:
   ```env
   OPENAI_API_KEY=your_key_here
   SEMANTIC_SCHOLAR_API_KEY=your_key_here
   ```
3. Build and start the services:
   ```bash
   docker-compose up --build
   ```
4. Access the application:
   - Frontend Dashboard: `http://localhost:3000`
   - FastAPI Backend API Docs: `http://localhost:8000/docs`

> Local (non-Docker) startup:
> Run `sentinentalrun.bat` from the project root. It starts:
> - Frontend (UI): `http://localhost:3000`
> - Backend (API): `http://localhost:8000`


## Features Included
- **Cybersecurity Theme**: Dark futuristic neon blue UI with Framer Motion animations.
- **FastAPI Backend**: Extensible backend structure for data ingestion and API validations.
- **Postgres + ChromaDB**: Persistent relation and vector data storage setup via Docker.
- **Interactive UI**: Drag and drop documents and get an automated Integrity Score with visual charts.
