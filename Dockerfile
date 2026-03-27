# Stage 1: Build the React Application
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Serve with FastAPI
FROM python:3.11-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Copy built frontend application into a "dist" folder within frontend
# The FastAPI app is configured to serve static files from ../frontend/dist
RUN mkdir -p /frontend/dist
COPY --from=frontend-builder /app/dist /frontend/dist

EXPOSE 8000

# Run FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
