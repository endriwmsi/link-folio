# 🌐 Link-Folio

A sleek and flexible **Link-in-Bio** project built with the modern web stack — powered by **Next.js 14**, **Tailwind CSS**, **shadcn/ui**, and **UploadThing**. Inspired by tools like Linktree and Bio.link, this project is ideal for anyone who wants to showcase links, profiles, or portfolios in a beautiful and customizable format.

---

## 📌 Project Goals

This project was designed with the intention of:

- 🧪 **Experimenting with New Libraries:** Integrating tools like `UploadThing`, `NextAuth`, and `shadcn/ui`, `Stripe`
- 🔐 **Practicing Authentication:** Implementing secure, flexible auth with `next-auth`
- 🧰 **Learning by Doing:** Deepening understanding of the App Router and server actions in Next.js
- 🧑‍🎨 **Design Exploration:** Creating minimalist, mobile-first UIs with utility-first CSS
- 🔄 **Reusable Components:** Building a scalable UI component system with tailwind and shadcn

---

## 🧠 Inspirations

- [Linktree](https://linktr.ee/)
- [bio.link](https://bio.link/)
- [Fruition](https://fruitionsite.com/) – using Notion as a website
- Simplicity and developer-first experiences from platforms like [Vercel](https://vercel.com)

---

## 🛠️ Tech Stack

- **Next.js 14** with App Router
- **Tailwind CSS** (with custom theming)
- **shadcn/ui** for modern, accessible components
- **UploadThing** for image upload
- **NextAuth** for authentication
- **TypeScript** for strong typing
- **PostgreSQL** (via Prisma)

---

## 🚀 Running Locally

To run this project locally, follow these steps:

### 1. Clone the repo

```bash
git clone https://github.com/your-username/link-folio.git
cd link-folio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a .env file

```bash
cp .env.example .env
```

DATABASE_URL: Your PostgreSQL connection string (configured via Prisma)
NEXTAUTH_SECRET: A secret string used by next-auth
UPLOADTHING_TOKEN: Your API token from UploadThing

### 4. Push the Prisma schema

```bash
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```
