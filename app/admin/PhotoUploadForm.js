"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

function UploadControls({ fileName, onChoose }) {
  const { pending } = useFormStatus();
  const ready = !!fileName;
  const submitClass = ["submit-button", ready && "ready", pending && "pending"].filter(Boolean).join(" ");

  return (
    <>
      <button type="button" onClick={onChoose} disabled={pending}>
        Choose photo
      </button>
      {fileName && <p className="photo-picker-filename">Selected: {fileName}</p>}

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
  const [fileName, setFileName] = useState("");

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
        onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
      />
      <UploadControls fileName={fileName} onChoose={() => inputRef.current?.click()} />
    </form>
  );
}
