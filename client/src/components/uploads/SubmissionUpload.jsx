import { useState } from 'react';
import { uploadFile } from '../../utils/uploadFile';

export default function SubmissionUpload({ orderId, onUploaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setError('');
    setLoading(true);
    try {
      const data = await uploadFile('submission', 'files', files, orderId);
      setUploadedUrls(data.urls);
      onUploaded(data.urls);
    } catch (err) {
      setError('Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submission-upload">
      <input type="file" accept=".pdf,.zip,image/*" multiple onChange={handleChange} disabled={loading} />
      {loading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploadedUrls.map((url, i) => (
        <a key={i} href={url} target="_blank" rel="noopener noreferrer">File {i + 1}</a>
      ))}
    </div>
  );
}