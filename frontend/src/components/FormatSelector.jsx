function FormatSelector({ format, setFormat, resolution, setResolution }) {
    return (
        <div className="format-selector">
            <h3>Choose Format</h3>

            <div className="format-options">
                <button
                    type="button"
                    className={format === "mp4" ? "active" : ""}
                    onClick={() => setFormat("mp4")}
                >
                    MP4 Video
                </button>

                <button
                    type="button"
                    className={format === "mp3" ? "active" : ""}
                    onClick={() => setFormat("mp3")}
                >
                    MP3 Audio
                </button>
            </div>

            {format === "mp4" && (
                <div className="resolution">
                    <label>Resolution</label>

                    <select
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                    >
                        <option value="360p">360p</option>
                        <option value="480p">480p</option>
                        <option value="720p">720p HD</option>
                        <option value="1080p">1080p Full HD</option>
                    </select>
                </div>
            )}
        </div>
    );
}

export default FormatSelector;