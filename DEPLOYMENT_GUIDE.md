# Deployment Guide: Vercel & Hostinger

This guide will help you deploy your **Next.js Frontend** to Vercel and connect your **Hostinger Domain**.

## Prerequisites

1.  **GitHub Account**: You need a GitHub repository to deploy easily to Vercel.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **Hostinger Account**: Where you bought your domain.

---

## Step 1: Push Your Code to GitHub

Since your project has a `frontend` and `backend` folder, we will push the entire root folder.

1.  Open your terminal in the root folder (`C:\Users\HP\portfolio`).
2.  Initialize Git:
    ```bash
    git init
    ```
3.  Create a `.gitignore` file in the root if it doesn't exist, adding `node_modules`, `.next`, `dist`, and `.env`.
4.  Commit your code:
    ```bash
    git add .
    git commit -m "Initial commit - Portfolio"
    ```
5.  Create a **New Repository** on GitHub (do not initialize with README/gitignore).
6.  Link and push:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Deploy Frontend to Vercel

1.  Go to your **Vercel Dashboard** and click **"Add New..."** -> **"Project"**.
2.  Import your GitHub repository.
3.  **Crucial Step**: In the "Configure Project" screen:
    *   Find **"Root Directory"**.
    *   Click **Edit** and select the `frontend` folder.
    *   (This tells Vercel to look for the Next.js app inside `frontend`, not the root).
4.  Click **Deploy**.
    *   Vercel will build your site. Once done, you will get a generic URL (e.g., `portfolio-xyz.vercel.app`).

---

## Step 3: Connect Hostinger Domain

1.  In your Vercel Project Dashboard:
    *   Go to **Settings** > **Domains**.
    *   Enter your domain name (e.g., `akhilkumar.com`) and click **Add**.
    *   Select the recommended option (usually targeting the root domain).

2.  Vercel will show you **DNS Records** (usually an **A Record** and a **CNAME Record**).
    *   **A Record**: `76.76.21.21` (Example)
    *   **CNAME**: `cname.vercel-dns.com` (for www)

3.  Go to **Hostinger**:
    *   Log in and go to **Domains** > **Manage** (for your specific domain).
    *   Find **DNS / Nameservers**.
    *   **Delete** any existing **A Records** that point to Hostinger's default parked page (looks like `0.0.0.0` or Hostinger IP).
    *   **Add New Record**:
        *   **Type**: A
        *   **Name**: @
        *   **Points to**: `76.76.21.21` (The IP Vercel gave you).
        *   **TTL**: Default (e.g., 14400 or 3600).
    *   **Add Another Record** (for www):
        *   **Type**: CNAME
        *   **Name**: www
        *   **Points to**: `cname.vercel-dns.com` (The value Vercel gave you).

4.  **Wait**: DNS propagation can take anywhere from a few minutes to 24 hours (usually fast).
5.  Back in Vercel, the domain configuration will turn **Green** when active.

---

## Step 4: (Optional) Backend Deployment

If your contact form needs to work properly, you need to deploy the `backend` (NestJS) as well. Vercel is primarily for Frontends.

For the backend, you have a few options:
1.  **Render.com / Railway.app (Recommended)**: Good for Node.js/NestJS backends.
    *   Connect Repo -> Set Root Directory to `backend` -> Build Command `npm run build` -> Start Command `npm run start:prod`.
2.  **VPS (Hostinger VPS)**: If you have a VPS, you can host it there manually using PM2 and Nginx.

Once deployed, update your Frontend's `.env` or API calls to point to the *Live Backend URL* instead of `localhost:3001`.

