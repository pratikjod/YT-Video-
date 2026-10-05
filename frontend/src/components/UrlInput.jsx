function UrlInput({ url, setUrl, onAnalyze, loading }) {
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!url.trim()) {
            return;
        }

        onAnalyze(url);
    };

    return (
        <form onSubmit={handleSubmit} className="url-form">

            <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube or authorized media URL..."
                disabled={loading}
            />

            <button
                type="submit"
                disabled={loading}
            >
                {loading ? "Analyzing..." : "Analyze"}
            </button>

        </form>
    );
}

export default UrlInput;