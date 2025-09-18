# Unique Search Queries Finder for MS Rewards (Vibe-Coded with AI)

## Overview

Welcome to **Unique Search Queries Finder for MS Rewards (Vibe-Coded with AI)**! This is a full-stack web application designed to help users earn Microsoft Rewards points by generating unique, human-like search queries for Bing searches. The app automates the process of fetching a list of trending or random queries, displaying them as interactive cards, and allowing one-click actions to search them on Bing with a built-in timer.

### Key Features
- **Query Generation**: Fetches up to 30 unique search queries from a curated list (e.g., "how to file income tax in india", "best pizza near me").
- **Interactive Cards**: Flip cards show queries on the front and "Copy" / "Open" buttons on the back. "Open" launches Bing search in a new tab with a timer notification.
- **Customizable Settings**: Adjust the number of queries (1-30) and timer duration (1-300 seconds).
- **Audio Feedback**: Plays a sound when the timer finishes or on copy action (volume adjustable).
- **Background Video**: Immersive looping video background for a modern look.
- **Responsive Design**: Works on desktop and mobile using Tailwind CSS.
- **Live Demo**: Access the deployed app at [https://unique-search-queries-app.onrender.com](https://unique-search-queries-app.onrender.com). Note: The free tier may sleep after inactivity, causing a short delay on first load.

The backend uses Flask to serve the API and static React files, while the frontend is built with React and Vibe-Coded with AI using xAI's Grok to enhance development efficiency.

## Technologies Used
- **Backend**: Python 3, Flask (web framework), Gunicorn (production server).
- **Frontend**: React 18, Vite (build tool), Tailwind CSS (styling).
- **Deployment**: Render.com (free hosting).
- **Other**: PostCSS, Autoprefixer for CSS processing.

## File Structure
```
Unique-Search-Queries-Finder-For-MS-Rewards/
├── backend/
│   ├── server.py          # Flask app: API endpoint /api/trends, serves static files
│   ├── requirements.txt   # Python dependencies (Flask, Gunicorn, flask-cors)
│   ├── static/            # Built React files (copied from frontend/dist)
│   └── venv/              # Python virtual environment (ignored in Git)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component: UI logic, fetch, cards, timer
│   │   ├── styles.css     # Custom CSS with Tailwind directives
│   │   ├── assets/        # bg-loop.mp4 (background video), timer-done.mp3 (sound)
│   │   └── main.jsx       # React entry point (imports App.jsx)
│   ├── package.json       # Node dependencies and scripts
│   ├── tailwind.config.js # Tailwind configuration
│   ├── postcss.config.cjs # PostCSS setup
│   ├── index.html         # Vite entry HTML
│   └── vite.config.js     # Vite configuration (if present)
├── .gitignore             # Ignores node_modules, venv, dist
└── README.md              # This file
```

## How It Works
1. **Frontend (React)**: User sets query count and timer, clicks "Find Queries". It fetches from `/api/trends?max=N`.
2. **Backend (Flask)**: `/api/trends` randomly selects N queries from a hardcoded list (`HUMAN_QUERIES` in server.py) and returns JSON `{ "nested": [["query1"], ["query2"], ...] }`.
3. **Cards**: Display queries; flip on hover to show actions. "Open" searches Bing; timer plays sound after delay.
4. **Integration**: Flask serves React build from `/static` and handles API routes.

## Quick Start: Run Locally (For Beginners)

### Prerequisites
- **Node.js**: Download from [nodejs.org](https://nodejs.org) (LTS version, e.g., 20.x). Install and verify: `node --version` in Command Prompt/PowerShell.
- **Python 3.8+**: Download from [python.org](https://python.org). Install and verify: `python --version`.
- **Git**: Optional, but needed for cloning. Download from [git-scm.com](https://git-scm.com).

### Step 1: Clone or Download the Repo
- Go to [https://github.com/tan90shq/Unique-Search-Queries-Finder-For-MS-Rewards](https://github.com/tan90shq/Unique-Search-Queries-Finder-For-MS-Rewards).
- Click "Code" > "Download ZIP" or clone: `git clone https://github.com/tan90shq/Unique-Search-Queries-Finder-For-MS-Rewards.git`.
- Extract/unzip to a folder (e.g., `C:\Users\YourName\Desktop\project`).

### Step 2: Set Up Frontend (React)
1. Open Command Prompt/PowerShell and navigate: `cd path\to\project\frontend`.
2. Install dependencies: `npm install`.
3. Build the app: `npm run build`. This creates a `dist` folder with static files.
4. Copy files: Create `backend/static` if missing, then copy `dist/*` to `backend/static` (use File Explorer or `xcopy dist\* backend\static\ /s /e` in cmd).

### Step 3: Set Up Backend (Flask)
1. Navigate: `cd ..\backend`.
2. Create virtual environment: `python -m venv venv`.
3. Activate: On Windows: `venv\Scripts\activate`. (You may need to allow scripts: Run PowerShell as Admin, `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`).
4. Install dependencies: `pip install -r requirements.txt`. (If missing, create `requirements.txt` with: `Flask==2.3.2`, `gunicorn==20.1.0`, `flask-cors==4.0.0`).
5. Test: `python server.py`. Open http://localhost:5000 in browser.

### Step 4: Run the App
- With venv active, run `python server.py`.
- Visit http://localhost:5000. Adjust queries/timer, click "Find Queries", and interact with cards.
- Stop: Ctrl+C in terminal.

### Troubleshooting
- **Port Error**: Change port in `server.py` (e.g., `port=5001`).
- **Fetch Error**: Ensure relative path `/api/trends` in App.jsx; test API at http://localhost:5000/api/trends.
- **Build Fails**: Run `npm install` again; check console for errors.
- **Video/Sound Missing**: Ensure `assets/bg-loop.mp4` and `timer-done.mp3` are in `frontend/src/assets`.

## Deployed Online (Recommended, Easy)
- The app is already deployed at [https://unique-search-queries-app.onrender.com](https://unique-search-queries-app.onrender.com).

## Contributing
- Fork the repo, make changes, submit a PR.
- Report issues on GitHub.

## License
MIT License. Feel free to use/modify.

## Author
- **Tan90shq**: [GitHub](https://github.com/tan90shq) | [Instagram](https://instagram.com/tan90shq/)

Happy querying and earning Rewards! 🚀