import { getDogMeta, getEntries } from "@/lib/blob";
import { uploadPhotoAction } from "../../actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DogAdminPage({ params, searchParams }) {
  const { slug } = params;
  const meta = await getDogMeta(slug);
  if (!meta) notFound();

  const entries = await getEntries(slug);
  const boundUpload = uploadPhotoAction.bind(null, slug);
  const shareUrl = `https://YOUR-DOMAIN.vercel.app/dog/${slug}`;

  return (
    <div>
      <p>
        <a href="/admin">&larr; All dogs</a>
      </p>
      <h1>{meta.name}</h1>
      <p className="subtitle">Owner: {meta.owner}</p>

      <div className="card">
        <strong>Link to send the owner:</strong>
        <div className="share-url">/dog/{slug}</div>
        <p style={{ fontSize: "0.8rem", color: "#9a8f83" }}>
          Add your Vercel domain in front, e.g. {shareUrl}
        </p>
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
          {entry.caption && <p className="entry-caption">{entry.caption}</p>}
        </div>
      ))}
    </div>
  );
}
