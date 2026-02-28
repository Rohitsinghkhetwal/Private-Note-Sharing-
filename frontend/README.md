# PrivateNote — Frontend (Next.js + TypeScript + Tailwind)

## Tech Stack
- **Next.js 14** — App Router
- **TypeScript** — fully typed, strict mode
- **Tailwind CSS** — utility-first styling
- **Axios** — API calls

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx              → Root layout
│   ├── globals.css             → Tailwind + custom component classes
│   ├── page.tsx                → Home page (create note)
│   ├── not-found.tsx           → 404 page
│   └── note/[id]/
│       └── page.tsx            → Note view (unlock + summarize)
│
├── components/
│   ├── Navbar.tsx              → Top nav
│   ├── CreateNoteForm.tsx      → Create note form
│   ├── NoteCreatedView.tsx     → Success screen with link + password
│   ├── UnlockNoteForm.tsx      → Password unlock form
│   ├── NoteView.tsx            → Unlocked note + AI summary
│   └── ui/
│       ├── Spinner.tsx         → Loading spinner
│       ├── Alert.tsx           → Error/success messages
│       └── CopyButton.tsx      → Clipboard copy button
│
├── lib/
│   └── api.ts                  → All typed API calls
│
└── types/
    └── index.ts                → All TypeScript types and interfaces
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create env file
cp .env.example .env.local

# 3. Fill in your backend URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 4. Start dev server
npm run dev
```

Open **http://localhost:3000**

## Type Check

```bash
npm run type-check
```

## Build for Production

```bash
npm run build
npm start
```
