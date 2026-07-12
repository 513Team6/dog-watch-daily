"use client";

export default function DeleteDogButton({ action, name }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete ${name} and all of their posted photos? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="delete-button">
        Delete
      </button>
    </form>
  );
}
