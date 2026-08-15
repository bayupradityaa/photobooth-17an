# Virtual Photobooth App

A vintage-style, brutalist web application for a virtual photobooth event. Built with Nuxt 3, TailwindCSS, and Cloudflare Pages (D1 Database & R2 Storage).

## Features
- **Virtual Photobooth**: Capture photos using webcam.
- **Adjust & Zoom**: Pinch-to-zoom and pan functionality to perfectly fit your photos into the frame slots.
- **Custom Frames**: Upload transparent PNG frames dynamically.
- **Admin Dashboard**: Manage frames, website status, and event name securely.
- **Cloudflare Integration**: Uses D1 for SQLite database and R2 for object storage.

## Prerequisites
- Node.js & npm (or Bun)
- A Cloudflare Account (for D1 and R2)
- Wrangler CLI installed globally (`npm install -g wrangler`)

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/photobooth.git
   cd photobooth
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Environment Variables**
   Copy `.dev.vars.example` to `.dev.vars` and set up your admin password.
   ```bash
   cp .dev.vars.example .dev.vars
   ```
   *Edit `.dev.vars` and change `ADMIN_PASSWORD` to your desired secure password.*

4. **Setup Cloudflare Local Services**
   The project uses Cloudflare D1 and R2. For local development, Wrangler will emulate these.
   Run the local database migrations/schema setup:
   ```bash
   npx wrangler d1 execute photobooth-app --local --file=./schema.sql
   ```

5. **Run the Development Server**
   ```bash
   bun run dev
   # or npm run dev
   ```
   Open `http://localhost:3000` to view the photobooth.
   Open `http://localhost:3000/admin` to access the Admin Dashboard.

## Deployment to Cloudflare Pages

1. **Create Cloudflare Resources**
   - Go to Cloudflare Dashboard and create a new **D1 Database** named `photobooth-app`.
   - Create an **R2 Bucket** named `photobooth-storage`.
   
2. **Update `wrangler.toml`**
   Update the `database_id` inside `wrangler.toml` with the newly created D1 Database ID from your Cloudflare dashboard.

3. **Initialize Production Database**
   ```bash
   npx wrangler d1 execute photobooth-app --remote --file=./schema.sql
   ```

4. **Set Production Secrets**
   Set your admin password in the Cloudflare Pages environment variables.
   Go to **Cloudflare Dashboard > Pages > your-project-name > Settings > Environment variables**, add `ADMIN_PASSWORD`, and set it to a secure password. Then click Encrypt and Save.

5. **Deploy!**
   ```bash
   bun run build
   npx wrangler pages deploy dist
   ```
   *(Alternatively, just push to GitHub if Cloudflare Pages is connected to your repository).*

## Tech Stack
- [Nuxt 3](https://nuxt.com/) (Vue.js Framework)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Cloudflare Workers/Pages](https://developers.cloudflare.com/pages/)
- Cloudflare D1 (SQLite) & R2 (Object Storage)
