import { useState } from "react";
import { convertMediaFile } from "../services/api";

function DownloadButton({
    filename,
    format,
    resolution
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDownload = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await convertMediaFile({
                filename,
                format,
                resolution
            });

            if (!result.success) {
                throw new Error(
                    result.message || "Conversion failed"
                );
            }

            const downloadUrl =
                `http://localhost:5000${result.downloadUrl}`;

            window.location.href = downloadUrl;

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to convert media"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="download-wrapper">

          <button
    type="button"
    onClick={handleDownload}
    disabled={downloading}
>
    {downloading
        ? "Downloading..."
        : "Download"}
</button>

            {error && (
                <p className="download-error">
                    {error}
                </p>
            )}

        </div>

        
    );
}

export default DownloadButton;