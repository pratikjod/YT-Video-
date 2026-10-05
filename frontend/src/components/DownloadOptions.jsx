
import { useState } from "react";
import { downloadMediaFromUrl } from "../services/api";

function DownloadOptions({
    visible,
    sourceType = "youtube",
    videoUrl
}) {
    const [downloading, setDownloading] = useState(false);
    const [downloadingOption, setDownloadingOption] = useState("");
    const [error, setError] = useState("");

    const handleDownload = async (format, quality) => {
        if (!videoUrl || !videoUrl.trim()) {
            setError("Please paste a video URL first.");
            return;
        }

        try {
            setDownloading(true);
            setDownloadingOption(format + "-" + quality);
            setError("");

            const response = await downloadMediaFromUrl({
                url: videoUrl.trim(),
                format: format,
                quality: quality
            });

            const contentType =
                response.headers &&
                response.headers["content-type"]
                    ? response.headers["content-type"]
                    : format === "mp3"
                        ? "audio/mpeg"
                        : "video/mp4";

            const blob = new Blob(
                [response.data],
                {
                    type: contentType
                }
            );

            const downloadUrl =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = downloadUrl;

            link.download =
                "video-" +
                quality +
                "." +
                format;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(
                downloadUrl
            );

        } catch (err) {
            console.error(
                "Download error:",
                err
            );

            setError(
                err.response &&
                err.response.data &&
                err.response.data.message
                    ? err.response.data.message
                    : "Download failed. Please try again."
            );

        } finally {
            setDownloading(false);
            setDownloadingOption("");
        }
    };


    if (!visible) {
        return null;
    }


    const videoOptions = [
        {
            quality: "1080p",
            format: "mp4"
        },
        {
            quality: "720p",
            format: "mp4"
        },
        {
            quality: "480p",
            format: "mp4"
        },
        {
            quality: "360p",
            format: "mp4"
        }
    ];


    const audioOptions = [
        {
            quality: "320kbps",
            format: "mp3"
        },
        {
            quality: "256kbps",
            format: "mp3"
        },
        {
            quality: "128kbps",
            format: "mp3"
        }
    ];


    return (
        <section className="download-options">

            <div className="download-heading">

                <h2>
                    Download
                </h2>

                <p>
                    Select your video or audio
                    quality and download.
                </p>

            </div>


            {error && (
                <div className="error">
                    <p>{error}</p>
                </div>
            )}


            {/* VIDEO */}

            <div className="download-category">

                <div className="category-title">

                    <div className="category-icon">
                        🎬
                    </div>

                    <div>
                        <h3>
                            Video
                        </h3>

                        <p>
                            Download video in MP4
                        </p>
                    </div>

                </div>


                <div className="option-list">

                    {videoOptions.map(function (option) {

                        var optionKey =
                            option.format +
                            "-" +
                            option.quality;

                        var isDownloading =
                            downloadingOption === optionKey;

                        return (
                            <div
                                className="download-option"
                                key={optionKey}
                            >

                                <strong>
                                    {option.quality}
                                </strong>

                                <span className="format-badge">
                                    MP4
                                </span>

                                <span>
                                    Video
                                </span>

                                <button
                                    type="button"
                                    className="download-option-button"
                                    onClick={function () {
                                        handleDownload(
                                            option.format,
                                            option.quality
                                        );
                                    }}
                                    disabled={downloading}
                                >
                                    {isDownloading
                                        ? "Downloading..."
                                        : "Download"}
                                </button>

                            </div>
                        );
                    })}

                </div>

            </div>


            {/* AUDIO */}

            <div className="download-category">

                <div className="category-title">

                    <div className="category-icon">
                        🎵
                    </div>

                    <div>
                        <h3>
                            Audio
                        </h3>

                        <p>
                            Download audio in MP3
                        </p>
                    </div>

                </div>


                <div className="option-list">

                    {audioOptions.map(function (option) {

                        var optionKey =
                            option.format +
                            "-" +
                            option.quality;

                        var isDownloading =
                            downloadingOption === optionKey;

                        return (
                            <div
                                className="download-option"
                                key={optionKey}
                            >

                                <strong>
                                    {option.quality}
                                </strong>

                                <span className="format-badge">
                                    MP3
                                </span>

                                <span>
                                    Audio
                                </span>

                                <button
                                    type="button"
                                    className="download-option-button"
                                    onClick={function () {
                                        handleDownload(
                                            option.format,
                                            option.quality
                                        );
                                    }}
                                    disabled={downloading}
                                >
                                    {isDownloading
                                        ? "Downloading..."
                                        : "Download"}
                                </button>

                            </div>
                        );
                    })}

                </div>

            </div>

        </section>
    );
}

export default DownloadOptions;

