"use client";

import { useState } from "react";

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function DateRangeEditor({ action, startDate, endDate }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await action(formData);
          setEditing(false);
        }}
      >
        <label htmlFor="startDate">First day watching</label>
        <input type="date" id="startDate" name="startDate" defaultValue={startDate} />

        <label htmlFor="endDate">Last day watching</label>
        <input type="date" id="endDate" name="endDate" defaultValue={endDate} />

        <div className="entry-edit-actions">
          <button type="submit">Save</button>
          <button type="button" className="cancel-button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  const range = startDate && endDate ? `${formatDate(startDate)} – ${formatDate(endDate)}` : null;

  return (
    <>
      <p className="subtitle" style={{ marginBottom: 8 }}>
        {range || "No dates set yet"}
      </p>
      <button type="button" className="edit-button" onClick={() => setEditing(true)}>
        Edit dates
      </button>
    </>
  );
}
