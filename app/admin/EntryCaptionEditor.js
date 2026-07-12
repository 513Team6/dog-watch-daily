"use client";

import { useState } from "react";

export default function EntryCaptionEditor({ action, caption }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await action(formData);
          setEditing(false);
        }}
      >
        <input type="text" name="caption" defaultValue={caption} placeholder="Had a great walk today!" />
        <div className="entry-edit-actions">
          <button type="submit">Save</button>
          <button type="button" className="cancel-button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      {caption && <p className="entry-caption">{caption}</p>}
      <button type="button" className="edit-button" onClick={() => setEditing(true)}>
        Edit caption
      </button>
    </>
  );
}
