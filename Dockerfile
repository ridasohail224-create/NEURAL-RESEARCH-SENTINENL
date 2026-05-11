# Step 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Step 2: Build Backend & Combine
FROM python:3.10-slim
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm

# Copy backend code
COPY backend/ .

# Copy frontend build to a static directory in backend
COPY --from=frontend-build /frontend/dist /app/static

# Expose backend port
EXPOSE 8000

# Command to run FastAPI and serve static files
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

