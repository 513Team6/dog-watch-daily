import { getDogMeta, getEntries } from "@/lib/blob";
import { uploadPhotoAction, editCaptionAction, editDatesAction } from "../../actions";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import CopyLinkButton from "../../CopyLinkButton";
import EntryCaptionEditor from "../../EntryCaptionEditor";
import DateRangeEditor from "../../DateRangeEditor";
import PhotoUploadForm from "../../PhotoUploadForm";

export const dynamic = "force-dynamic";

const ERROR_MESSAGES = {
  nofile: "Please choose a photo.",
  upload: "Something went wrong posting the photo. Please try again.",
};

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

  const smsMessage = `Thanks for trusting me with your dog! Get updates while you're away by clicking this link: ${shareUrl} -Walker the Dog Walker`;
  const smsHref = `sms:?&body=${encodeURIComponent(smsMessage)}`;

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
        <div className="share-actions">
          <a className="share-action-button" href={smsHref}>
            Send link
          </a>
          <CopyLinkButton url={shareUrl} />
        </div>
      </div>

      <div className="card">
        <strong>Dates watching:</strong>
        <DateRangeEditor
          action={editDatesAction.bind(null, slug)}
          startDate={meta.startDate}
          endDate={meta.endDate}
        />
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Post today's photo</h2>
        {searchParams?.success && <p style={{ color: "#2e7d32" }}>Photo posted!</p>}
        {searchParams?.error && (
          <p style={{ color: "#b3261e" }}>
            {ERROR_MESSAGES[searchParams.error] || "Something went wrong. Please try again."}
          </p>
        )}
        <PhotoUploadForm action={boundUpload} />
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
