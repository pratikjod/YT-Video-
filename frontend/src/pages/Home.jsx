import { useState } from "react";

import UrlInput from "../components/UrlInput";
import YouTubeInfo from "../components/YouTubeInfo";
import DownloadOptions from "../components/DownloadOptions";

import { analyzeYouTubeUrl } from "../services/api";

function Home() {
    const [url, setUrl] = useState("");
    const [youtubeData, setYoutubeData] = useState(null);

    const [urlLoading, setUrlLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDownloads, setShowDownloads] = useState(false);

    const handleAnalyze = async (value) => {
        setUrlLoading(true);
        setError("");
        setYoutubeData(null);
        setShowDownloads(false);

        try {
            const data = await analyzeYouTubeUrl(value);

            if (!data.success) {
                throw new Error(
                    data.message || "Unable to analyze URL"
                );
            }

            setYoutubeData(data);

        } catch (err) {
            console.error(
                "YouTube Analyze Error:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.message ||
                "Unable to analyze this URL.";

            setError(message);

        } finally {
            setUrlLoading(false);
        }
    };

    return (
        <main className="home">
            <section className="hero">

                {/* Page Badge */}
                <div className="badge">
                    Video Downloader
                </div>

                {/* Main Heading */}
                <h1>
                    Download <span>Videos</span>
                </h1>

                <p>
                    Paste a video URL to analyze the
                    title, thumbnail, duration and
                    available download options.
                </p>

                {/* URL Section */}
                <section className="paste-section">

                    <div className="section-title">
                        <h2>
                            Paste Video URL
                        </h2>

                        <p>
                            Enter a YouTube video or
                            Shorts URL to analyze it.
                        </p>
                    </div>

                    <UrlInput
                        url={url}
                        setUrl={setUrl}
                        loading={urlLoading}
                        onAnalyze={handleAnalyze}
                    />

                    {/* Error */}
                    {error && (
                        <div className="error download-error">
                            <h3>
                                Unable to analyze URL
                            </h3>

                            <p>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* YouTube Information */}
                    <YouTubeInfo
                        data={youtubeData}
                    />

                    {/* Download Button */}
                    {youtubeData && (
                        <>
                            <div className="download-wrapper">

                                <button
                                    type="button"
                                    className="main-download-button"
                                    onClick={() =>
                                        setShowDownloads(
                                            !showDownloads
                                        )
                                    }
                                >
                                    {showDownloads
                                        ? "Hide Download Options"
                                        : "Download"}
                                </button>

                            </div>

                            {/* Download Options */}
                            <DownloadOptions
    visible={showDownloads}
    filename={null}
    sourceType="youtube"
    videoUrl={url}
/>
                        </>
                    )}

                </section>

            </section>
        </main>
    );
}

export default Home;