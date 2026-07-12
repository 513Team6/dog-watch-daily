import { put, list } from "@vercel/blob";

// Everything lives under dogs/{slug}/...
//   dogs/{slug}/meta.json     -> { name, owner, createdAt }
//   dogs/{slug}/entries.json  -> [{ url, caption, date, uploadedAt }]
//   dogs/{slug}/photos/...    -> the actual image files

export function slugify(name) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function findBlob(pathname) {
  const { blobs } = await list({ prefix: pathname, limit: 1 });
  return blobs.find((b) => b.pathname === pathname) || null;
}

export async function listDogs() {
  const { blobs } = await list({ prefix: "dogs/" });
  const metaBlobs = blobs.filter((b) => b.pathname.endsWith("/meta.json"));
  const dogs = await Promise.all(
    metaBlobs.map(async (b) => {
      const slug = b.pathname.split("/")[1];
      const meta = await fetchJson(b.url);
      return meta ? { slug, ...meta } : null;
    })
  );
  return dogs.filter(Boolean).sort((a, b) => (a.name > b.name ? 1 : -1));
}

export async function getDogMeta(slug) {
  const blob = await findBlob(`dogs/${slug}/meta.json`);
  if (!blob) return null;
  return fetchJson(blob.url);
}

export async function getEntries(slug) {
  const blob = await findBlob(`dogs/${slug}/entries.json`);
  if (!blob) return [];
  const entries = await fetchJson(blob.url);
  return entries || [];
}

export async function createDog({ name, owner }) {
  const slug = slugify(name);
  await put(`dogs/${slug}/meta.json`, JSON.stringify({ name, owner, createdAt: new Date().toISOString() }), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  await put(`dogs/${slug}/entries.json`, JSON.stringify([]), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return slug;
}

export async function addPhotoEntry(slug, file, caption) {
  const timestamp = Date.now();
  const ext = (file.name && file.name.split(".").pop()) || "jpg";
  const photoBlob = await put(`dogs/${slug}/photos/${timestamp}.${ext}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  const entries = await getEntries(slug);
  entries.unshift({
    url: photoBlob.url,
    caption: caption || "",
    date: new Date().toISOString().slice(0, 10),
    uploadedAt: new Date().toISOString(),
  });

  await put(`dogs/${slug}/entries.json`, JSON.stringify(entries), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return entries;
}
