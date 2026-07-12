import { getDogMeta, getEntries } from "@/lib/blob";
import { uploadPhotoAction, editCaptionAction } from "../../actions";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import CopyLinkButton from "../../CopyLinkButton";
import EntryCaptionEditor from "../../EntryCaptionEditor";

export const dynamic = "force-dynamic";

export default async function DogAdminPage({ params, searchParams }) {
  const { slug } = params;
  const meta = await getDogMeta(slug);
  if (!meta) notFound();

  const entries = await getEntries(slug);
  const boundUpload = uploadPhotoAction.bind(null, slug);

  const headersList = headers();
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const shareUrl = `${protocol}://${host}/dog/${slug}`;

  return (
    <div>
      <p>
        <a href="/admin">&larr; All dogs</a>
      </p>
      <h1>{meta.name}</h1>
      <p className="subtitle">Owner: {meta.owner}</p>

      <div className="card">
        <strong>Link to send the owner:</strong>
        <div className="share-url">{shareUrl}</div>
        <CopyLinkButton url={shareUrl} />
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Post today's photo</h2>
        {searchParams?.success && <p style={{ color: "#2e7d32" }}>Photo posted!</p>}
        {searchParams?.error && <p style={{ color: "#b3261e" }}>Please choose a photo.</p>}
        <form action={boundUpload}>
          <label htmlFor="photo">Photo</label>
          <input type="file" id="photo" name="photo" accept="image/*" capture="environment" required />

          <label htmlFor="caption">Caption</label>
          <input type="text" id="caption" name="caption" placeholder="Had a great walk today!" />

          <button type="submit">Post photo</button>
        </form>
      </div>

      <h2>Posted so far</h2>
      {entries.length === 0 && <p className="empty">Nothing posted yet.</p>}
      {entries.map((entry, i) => (
        <div className="card" key={i}>
          <img className="entry-photo" src={entry.url} alt={entry.caption || meta.name} />
          <div className="entry-date">{entry.date}</div>
          <EntryCaptionEditor
            action={editCaptionAction.bind(null, slug, entry.uploadedAt)}
            caption={entry.caption}
          />
        </div>
      ))}
    </div>
  );
}
