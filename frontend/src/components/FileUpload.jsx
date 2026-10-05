import { useState } from "react";
import { uploadMediaFile } from "../services/api";

function FileUpload({ onUploaded }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        setFileName(file.name);
        setError("");
        setLoading(true);

        try {
            const result = await uploadMediaFile(file);

            if (!result.success) {
                throw new Error(
                    result.message || "Upload failed"
                );
            }

            onUploaded(result);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to upload file"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="file-upload">

            <label className="file-label">
                <input
                    type="file"
                    accept="video/*,audio/*"
                    onChange={handleFileChange}
                    disabled={loading}
                />

                {loading
                    ? "Uploading & Analyzing..."
                    : "Choose Video / Audio File"}
            </label>

            {fileName && (
                <p className="selected-file">
                    Selected: {fileName}
                </p>
            )}

            {error && (
                <p className="upload-error">
                    {error}
                </p>
            )}

        </div>
    );
}

export default FileUpload;