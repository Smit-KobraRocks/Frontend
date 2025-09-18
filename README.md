# Pipeline Studio — Local Development Guide

This project contains a React front-end and a FastAPI back-end that work together to design and validate pipeline graphs.

## Prerequisites

Make sure the following tools are installed before you begin:

- [Node.js](https://nodejs.org/) (version 18 or newer is recommended)
- npm (bundled with Node.js)
- [Python 3.10+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/)

> Tip: On macOS and Linux you can keep project-specific dependencies isolated by using a Python virtual environment (`python -m venv .venv`).

## 1. Back-end API setup

1. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\\Scripts\\activate
   ```
2. Install the required packages:
   ```bash
   pip install fastapi uvicorn
   ```
3. Start the FastAPI server from the repository root:
   ```bash
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```
   The API will be available at `http://localhost:8000` and exposes a health check at `/` along with the `POST /pipelines/parse` endpoint used by the front-end.

## 2. Front-end app setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. (Optional) Configure the API base URL. The front-end expects the FastAPI server to run on port `8000` by default. To point it to a different URL, create a `.env` file in the `frontend` directory with:
   ```bash
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The application will open at [http://localhost:3000](http://localhost:3000). Changes made to the React source code trigger automatic reloads.

## 3. Available scripts

From the `frontend` directory you can run:

- `npm start` — Launches the development server.
- `npm test` — Runs the interactive test runner.
- `npm run build` — Creates an optimized production build in the `build` folder.

## 4. Project structure

```
.
├── backend/          # FastAPI application
├── frontend/         # React application created with Create React App
└── README.md         # This guide
```

With both servers running, the React interface can submit pipeline data to the FastAPI endpoint and display validation results in the browser.
