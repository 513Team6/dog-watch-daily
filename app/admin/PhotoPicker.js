"use client";

import { useRef, useState } from "react";

export default function PhotoPicker() {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  function openPicker(useCamera) {
    const input = inputRef.current;
    if (!input) return;
    if (useCamera) {
      input.setAttribute("capture", "environment");
    } else {
      input.removeAttribute("capture");
    }
    input.click();
  }

  return (
    <div>
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
      <div className="photo-picker-buttons">
        <button type="button" onClick={() => openPicker(false)}>
          Choose photo
        </button>
        <button type="button" onClick={() => openPicker(true)}>
          Take photo
        </button>
      </div>
      {fileName && <p className="photo-picker-filename">Selected: {fileName}</p>}
    </div>
  );
}
