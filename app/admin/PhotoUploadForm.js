"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

// Vercel Functions hard-cap request bodies at 4.5MB, so anything we send
// through the upload Server Action needs real headroom under that.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const RESIZE_THRESHOLD_BYTES = 3 * 1024 * 1024;
const MAX_DIMENSION = 1920;

function isHeicFile(file) {
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  return name.endsWith(".heic") || name.endsWith(".heif") || type.includes("heic") || type.includes("heif");
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

// HEIC can't be reliably decoded via <canvas> across browsers, so it's left
// for the existing server-side heic-convert step instead.
async function compressImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);

  let quality = 0.82;
  let blob = await canvasToBlob(canvas, quality);
  while (blob && blob.size > MAX_UPLOAD_BYTES && quality > 0.4) {
    quality -= 0.15;
    blob = await canvasToBlob(canvas, quality);
  }
  if (!blob) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadControls({ selected, busy, onChoose }) {
  const { pending } = useFormStatus();
  const ready = !!selected && !busy;
  const submitClass = ["submit-button", ready && "ready", pending && "pending"].filter(Boolean).join(" ");

  return (
    <>
      <button type="button" onClick={onChoose} disabled={pending || busy}>
        Choose photo
      </button>
      {busy && <p className="photo-picker-filename">Preparing photo…</p>}
      {!busy && selected && (
        <p className="photo-picker-filename">
          Selected: {selected.name} ({formatBytes(selected.size)})
        </p>
      )}

      <label htmlFor="caption">Caption (optional)</label>
      <input type="text" id="caption" name="caption" placeholder="Had a great walk today!" disabled={pending} />

      <button type="submit" disabled={!ready || pending} className={submitClass}>
        <span className="submit-button-fill" />
        <span className="submit-button-label">{pending ? "Posting…" : "Post photo"}</span>
      </button>
    </>
  );
}

export default function PhotoUploadForm({ action }) {
  const inputRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setSelected(null);
      return;
    }

    if (isHeicFile(file) || !file.type.startsWith("image/") || file.size <= RESIZE_THRESHOLD_BYTES) {
      setSelected(file);
      return;
    }

    setBusy(true);
    try {
      const compressed = await compressImage(file);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(compressed);
      if (inputRef.current) inputRef.current.files = dataTransfer.files;
      setSelected(compressed);
    } catch (err) {
      setSelected(file);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form action={action}>
      <label htmlFor="photo">Photo</label>
      <input
        ref={inputRef}
        type="file"
        id="photo"
        name="photo"
        accept="image/*"
        required
        className="photo-picker-input"
        onChange={handleFileChange}
      />
      <UploadControls selected={selected} busy={busy} onChoose={() => inputRef.current?.click()} />
    </form>
  );
}
