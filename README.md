<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Recap Blog - Next.js

A modern blog application built with Next.js, React, and TypeScript.

## Features

- 🎨 Modern and responsive design
- 📱 Mobile-friendly interface
- 🚀 Built with Next.js 15 (App Router)
- 💅 Styled with Tailwind CSS
- 📝 Category-based blog posts
- 🔍 Dynamic routing for posts

## Run Locally

**Prerequisites:** Node.js 18+ and npm

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── categories/     # Categories page
│   ├── post/[id]/      # Dynamic post pages
│   └── tech/           # Tech category page
├── components/          # React components
├── data.ts             # Blog data
└── types.ts            # TypeScript types
```
