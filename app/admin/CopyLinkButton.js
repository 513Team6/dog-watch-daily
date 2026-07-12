"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" className="copy-link-button" onClick={handleCopy}>
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
