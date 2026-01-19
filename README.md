# Rush Hour RP Website

**Created by Vexel Studios**

This is the official website application for Rush Hour Roleplay (RHRP).

## Deployment Instructions

If you have purchased this website package from Vexel Studios, follow these instructions to set up and deploy the site.

### Prerequisites

*   [Node.js](https://nodejs.org/) (Version 16 or higher) installed on your machine.
*   A code editor like [VS Code](https://code.visualstudio.com/).
*   A [Firebase](https://firebase.google.com/) account (for the backend database and admin features).

### 1. Installation

1.  Unzip the project files to a folder on your computer.
2.  Open a terminal (Command Prompt or PowerShell) in that folder.
3.  Run the following command to install dependencies:
    ```bash
    npm install
    ```

### 2. Firebase Configuration

You need to connect the website to your own Firebase project for the Admin Panel, Staff Roster, and Gallery to work.

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  Enable **Firestore Database** and **Authentication** (Google Sign-In).
3.  Go to Project Settings -> General -> "Your apps" -> Select Web (</>).
4.  Copy the configuration keys (apiKey, authDomain, projectId, etc.).
5.  Create a file named `.env` in the root of your project folder.
6.  Add your keys to the `.env` file like this:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    GEMINI_API_KEY=your_gemini_api_key_if_using_ai_features
    ```

### 3. Running Locally

To test the site on your computer before going live:

```bash
npm run dev
```

Open your browser to `http://localhost:3000` to see the site.

### 4. Custom Domain & Deployment

This project is pre-configured for **GitHub Pages**, but can be hosted anywhere (Vercel, Netlify, standard web hosting).

**GitHub Pages (Recommended):**
1.  Upload the files to a GitHub repository.
2.  Open `vite.config.ts` and ensure `base` is set to `'/'` if using a custom domain (e.g., `www.yourserver.com`) or `'/repo-name/'` if using a standard github.io URL.
3.  Push your code to the `main` branch.
4.  In GitHub Settings -> Pages:
    *   Source: Deploy from a branch
    *   Branch: `main`
    *   Folder: `/docs` (The project builds to the `docs` folder automatically).
5.  The site will be live.

**Custom Domain (CNAME):**
If using a custom domain with GitHub Pages:
1.  Edit the `public/CNAME` file.
2.  Replace the text inside with your domain (e.g., `rushhourrp.com`).
3.  Configure your DNS provider (GoDaddy, Namecheap) to point to GitHub Pages.

---
*For support or customization requests, please contact **Vexel Studios**.*
