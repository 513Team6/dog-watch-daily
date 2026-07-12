import { getDogMeta, getEntries } from "@/lib/blob";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export default async function DogPage({ params }) {
  const { slug } = params;
  const meta = await getDogMeta(slug);
  if (!meta) notFound();

  const entries = await getEntries(slug);

  return (
    <div>
      <h1>🐶 {meta.name}</h1>
      <p className="subtitle">Daily updates while you're away</p>

      {entries.length === 0 && (
        <p className="empty">No photos posted yet, check back soon!</p>
      )}

      {entries.map((entry, i) => (
        <div className="card" key={i}>
          <img className="entry-photo" src={entry.url} alt={entry.caption || meta.name} />
          <div className="entry-date">{formatDate(entry.date)}</div>
          {entry.caption && <p className="entry-caption">{entry.caption}</p>}
        </div>
      ))}
    </div>
  );
}

export async function generateMetadata({ params }) {
  const meta = await getDogMeta(params.slug);
  return {
    title: meta ? `${meta.name} — Daily Updates` : "Dog Watch Daily",
  };
}
