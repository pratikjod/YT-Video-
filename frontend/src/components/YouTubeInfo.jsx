function YouTubeInfo({ data }) {
    if (!data) {
        return null;
    }

    return (
        <section className="youtube-info">

            <div className="thumbnail-wrapper">
                <img
                    src={data.thumbnail}
                    alt={data.title}
                    className="youtube-thumbnail"
                />
            </div>

            <div className="youtube-details">

                <h2>{data.title}</h2>

                <p className="channel-name">
                    Channel: {data.channelTitle}
                </p>

                <div className="video-meta">

                    <div>
                        <span>Duration</span>
                        <strong>{data.duration}</strong>
                    </div>

                    <div>
                        <span>Video ID</span>
                        <strong>{data.videoId}</strong>
                    </div>

                </div>

                <a
                    href={data.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="watch-link"
                >
                    Watch on YouTube
                </a>

            </div>

        </section>
    );
}

export default YouTubeInfo;