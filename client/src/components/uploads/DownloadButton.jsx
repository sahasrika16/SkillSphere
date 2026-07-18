export default function DownloadButton({ fileUrl, label = 'Download' }) {
  if (!fileUrl) return null;
  return (
    <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
      <button className="download-btn">{label}</button>
    </a>
  );
}