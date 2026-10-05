const axios = require("axios");

async function getYouTubeVideoDetails(videoId) {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        throw new Error(
            "YouTube API key is not configured"
        );
    }

    const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
            params: {
                part: "snippet,contentDetails",
                id: videoId,
                key: apiKey
            }
        }
    );

    if (!response.data.items.length) {
        throw new Error(
            "YouTube video not found"
        );
    }

    const video = response.data.items[0];

    return {
        title: video.snippet.title,

        channelTitle:
            video.snippet.channelTitle,

        description:
            video.snippet.description,

        thumbnail:
            video.snippet.thumbnails.high?.url ||
            video.snippet.thumbnails.medium?.url ||
            video.snippet.thumbnails.default?.url,

        publishedAt:
            video.snippet.publishedAt,

        duration:
            video.contentDetails.duration
    };
}

module.exports = {
    getYouTubeVideoDetails
};