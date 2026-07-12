# Dog Watch Daily

A tiny site for posting a daily photo update for each dog you're watching.
Each dog gets its own private-ish link (no login needed) to send to the owner
at the start of the week. You post updates from a password-protected admin
page on your phone.

Stack: Next.js (App Router) + Vercel + Vercel Blob storage. No database.

## How it works

- `/admin` — password-protected. Add a dog (name + owner), get a unique link,
  and upload a photo + caption each day.
- `/dog/[slug]` — the public page you send to the owner. Shows all photos for
  that dog, newest first. No login required, the link itself is the "key."

## One-time setup

**1. Get a free GitHub account** (skip if you have one) — github.com

**2. Get a free Vercel account** — vercel.com, sign in with GitHub.

**3. Push this project to GitHub**

From this folder:

```bash
git init
git add .
git commit -m "Dog Watch Daily"
```

Create a new empty repo on GitHub (github.com/new, no README/gitignore), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/dog-watch-daily.git
git branch -M main
git push -u origin main
```

**4. Import the project into Vercel**

- Go to vercel.com/new
- Select the `dog-watch-daily` GitHub repo and click Import
- Leave all build settings as default (Next.js is auto-detected)
- Don't click Deploy yet — add the environment variable first (next step),
  or add it after and redeploy.

**5. Add the admin password**

In the Vercel project → Settings → Environment Variables, add:

- `ADMIN_PASSWORD` = a password you'll remember (e.g. `walkies2026`)

**6. Enable Blob storage**

In the Vercel project → Storage tab → Create Database → Blob. Vercel
automatically adds a `BLOB_READ_WRITE_TOKEN` environment variable for you —
no extra signup, no extra bill as long as you stay in the free tier.

**7. Deploy**

Click Deploy (or redeploy if you already deployed once before adding the env
vars). Vercel gives you a URL like `dog-watch-daily.vercel.app`.

## Weekly / daily use

1. Someone asks you to watch their dog for the week.
2. Go to `your-site.vercel.app/admin`, log in with your password.
3. Add the dog (name + owner). You'll get a link like
   `your-site.vercel.app/dog/rex-a1b2c`.
4. Text or email that link to the owner at the start of the week.
5. Each day, open `/admin`, tap into the dog, upload a photo from your
   phone's camera roll (or take one directly — the file input supports
   camera capture), add a short caption, hit Post.
6. The owner opens their link any time to see the latest photo and a running
   feed of the whole week.

No cleanup needed between dogs — old dog pages just stay live if the owner
wants to look back, or you can leave them and start fresh entries for the
next dog.

## Local development (optional)

Only needed if you want to test changes on your computer before pushing:

```bash
npm install
cp .env.example .env.local   # fill in ADMIN_PASSWORD; Blob token needs `vercel env pull`
npm run dev
```

## Costs

Free, on Vercel's Hobby plan, for personal-scale use: a handful of dogs and a
photo or two a day. Vercel Blob's free tier is well above what a few weeks of
daily phone photos will use.

## Notes on privacy

Each dog's link contains a random suffix (e.g. `rex-a1b2c`) so it isn't
easily guessable, but it isn't a real login either — anyone with the link can
view that dog's photos. That's the intended trade-off for something this
lightweight. If you ever want real per-owner accounts, that's a bigger build
(auth + database) — worth doing only if this grows past a casual neighborhood
favor.
