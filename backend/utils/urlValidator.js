function validateMediaUrl(url) {
    if (!url || typeof url !== "string") {
        return {
            valid: false,
            message: "URL is required"
        };
    }

    try {
        const parsedUrl = new URL(url.trim());

        if (
            !["http:", "https:"].includes(
                parsedUrl.protocol
            )
        ) {
            return {
                valid: false,
                message:
                    "Only HTTP and HTTPS URLs are allowed"
            };
        }

        return {
            valid: true,
            message: "Valid URL"
        };

    } catch (error) {
        return {
            valid: false,
            message: "Invalid URL"
        };
    }
}


function extractYouTubeVideoId(url) {
    if (!url || typeof url !== "string") {
        return null;
    }

    try {
        const parsedUrl =
            new URL(url.trim());

        const hostname =
            parsedUrl.hostname
                .toLowerCase()
                .replace(/^www\./, "");

        let videoId = null;


        // --------------------------------
        // youtu.be/VIDEO_ID
        // --------------------------------

        if (hostname === "youtu.be") {
            videoId =
                parsedUrl.pathname
                    .split("/")
                    .filter(Boolean)[0];
        }


        // --------------------------------
        // youtube.com
        // --------------------------------

        if (hostname === "youtube.com") {

            // https://youtube.com/watch?v=VIDEO_ID
            if (
                parsedUrl.pathname ===
                "/watch"
            ) {
                videoId =
                    parsedUrl.searchParams.get(
                        "v"
                    );
            }


            // https://youtube.com/shorts/VIDEO_ID
            else if (
                parsedUrl.pathname.startsWith(
                    "/shorts/"
                )
            ) {
                videoId =
                    parsedUrl.pathname
                        .split("/")
                        .filter(Boolean)[1];
            }


            // https://youtube.com/embed/VIDEO_ID
            else if (
                parsedUrl.pathname.startsWith(
                    "/embed/"
                )
            ) {
                videoId =
                    parsedUrl.pathname
                        .split("/")
                        .filter(Boolean)[1];
            }


            // https://youtube.com/live/VIDEO_ID
            else if (
                parsedUrl.pathname.startsWith(
                    "/live/"
                )
            ) {
                videoId =
                    parsedUrl.pathname
                        .split("/")
                        .filter(Boolean)[1];
            }
        }


        // --------------------------------
        // Validate YouTube Video ID
        // --------------------------------

        if (
            !videoId ||
            !/^[a-zA-Z0-9_-]{11}$/.test(
                videoId
            )
        ) {
            return null;
        }

        return videoId;

    } catch (error) {
        return null;
    }
}


function validateYouTubeUrl(url) {
    const videoId =
        extractYouTubeVideoId(url);

    if (!videoId) {
        return {
            valid: false,
            message:
                "Invalid YouTube video URL. Please paste a valid YouTube video or Shorts link."
        };
    }

    return {
        valid: true,
        videoId
    };
}


module.exports = {
    validateMediaUrl,
    extractYouTubeVideoId,
    validateYouTubeUrl
};