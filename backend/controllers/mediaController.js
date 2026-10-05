const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const { analyzeMedia } =
    require("../services/mediaService");

const {
    validateYouTubeUrl
} = require("../utils/urlValidator");

const {
    getYouTubeVideoDetails
} = require("../services/youtubeService");

const tempDirectory = path.resolve(
    __dirname,
    "../temp"
);

/* =========================
   SAFE TEMP FILE
========================= */

function safeTempFile(filename) {
    if (
        !filename ||
        filename !== path.basename(filename)
    ) {
        return null;
    }

    return path.join(
        tempDirectory,
        filename
    );
}

/* =========================
   YOUTUBE ANALYZE
========================= */

async function analyzeYouTube(
    req,
    res,
    next
) {
    try {
        const { url } = req.body;

        const validation =
            validateYouTubeUrl(url);

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message:
                    validation.message
            });
        }

        const videoId =
            validation.videoId;

        const details =
            await getYouTubeVideoDetails(
                videoId
            );

        res.json({
            success: true,

            videoId,

            watchUrl:
                `https://www.youtube.com/watch?v=${videoId}`,

            ...details
        });

    } catch (error) {
        next(error);
    }
}

/* =========================
   ANALYZE LOCAL MEDIA
========================= */

async function analyzeLocalMedia(
    req,
    res,
    next
) {
    try {
        const { filename } = req.body;

        const filePath =
            safeTempFile(filename);

        if (!filePath) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid filename"
            });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message:
                    "Media file not found"
            });
        }

        const result =
            await analyzeMedia(filePath);

        res.json({
            success: true,

            filename,

            data: result
        });

    } catch (error) {
        next(error);
    }
}

/* =========================
   UPLOAD MEDIA
========================= */

async function uploadMedia(
    req,
    res,
    next
) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "Media file is required"
            });
        }

        const filePath =
            req.file.path;

        const result =
            await analyzeMedia(filePath);

        res.json({
            success: true,

            message:
                "File uploaded and analyzed successfully",

            filename:
                req.file.filename,

            originalName:
                req.file.originalname,

            size:
                req.file.size,

            data:
                result
        });

    } catch (error) {
        next(error);
    }
}

/* =========================
   GET MEDIA OPTIONS
========================= */

async function getMediaOptions(
    req,
    res,
    next
) {
    try {
        const { filename } = req.body;

        const filePath =
            safeTempFile(filename);

        if (!filePath) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid filename"
            });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message:
                    "Media file not found"
            });
        }

        const result =
            await analyzeMedia(filePath);

        const fileStats =
            fs.statSync(filePath);

        const videoStreams =
            result.streams.filter(
                stream =>
                    stream.codec_type ===
                    "video"
            );

        const audioStreams =
            result.streams.filter(
                stream =>
                    stream.codec_type ===
                    "audio"
            );

        res.json({
            success: true,

            filename,

            fileSize:
                fileStats.size,

            duration:
                result.format.duration ||
                null,

            format:
                result.format.format_name ||
                null,

            video:
                videoStreams.map(
                    stream => ({
                        codec:
                            stream.codec_name,

                        width:
                            stream.width,

                        height:
                            stream.height
                    })
                ),

            audio:
                audioStreams.map(
                    stream => ({
                        codec:
                            stream.codec_name
                    })
                )
        });

    } catch (error) {
        next(error);
    }
}

/* =========================
   DOWNLOAD LOCAL MEDIA
========================= */

function downloadMedia(
    req,
    res,
    next
) {
    try {
        const filename =
            req.params.filename;

        const filePath =
            safeTempFile(filename);

        if (!filePath) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid filename"
            });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message:
                    "Media file not found"
            });
        }

        res.download(
            filePath,
            filename
        );

    } catch (error) {
        next(error);
    }
}

/* =========================
   DOWNLOAD MEDIA FROM URL
   USING YT-DLP
========================= */

async function downloadFromUrl(req, res, next) {
    try {
        const {
            url,
            format = "mp4",
            quality = "720p"
        } = req.body;

        console.log("================================");
        console.log("DOWNLOAD API HIT");
        console.log("URL:", url);
        console.log("FORMAT:", format);
        console.log("QUALITY:", quality);
        console.log("================================");

        if (!url || typeof url !== "string") {
            return res.status(400).json({
                success: false,
                message: "Media URL is required"
            });
        }

        try {
            new URL(url.trim());
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid media URL"
            });
        }

        if (!["mp4", "mp3"].includes(format)) {
            return res.status(400).json({
                success: false,
                message: "Invalid download format"
            });
        }

        const videoQualities = [
            "360p",
            "480p",
            "720p",
            "1080p"
        ];

        const audioQualities = [
            "128kbps",
            "256kbps",
            "320kbps"
        ];

        if (
            format === "mp4" &&
            !videoQualities.includes(quality)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid video quality"
            });
        }

        if (
            format === "mp3" &&
            !audioQualities.includes(quality)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid audio quality"
            });
        }

        if (!fs.existsSync(tempDirectory)) {
            fs.mkdirSync(tempDirectory, {
                recursive: true
            });
        }

        const downloadId =
            "download_" + Date.now();

        const outputTemplate =
            path.join(
                tempDirectory,
                downloadId + ".%(ext)s"
            );

        let args = [
            "--no-playlist",
            "--newline",
            "-o",
            outputTemplate
        ];

        // =========================
        // VIDEO MP4
        // =========================

        if (format === "mp4") {
            const height = parseInt(
                quality.replace("p", ""),
                10
            );

            args.push(
    "-f",
    "bv*[height<=" +
        height +
        "][vcodec^=avc1]+ba/b[height<=" +
        height +
        "][vcodec^=avc1]/bv*[height<=" +
        height +
        "]+ba/b[height<=" +
        height +
        "]",
    "--merge-output-format",
    "mp4"
);
        }

        // =========================
        // AUDIO MP3
        // =========================

        if (format === "mp3") {
            const bitrate = parseInt(
                quality.replace("kbps", ""),
                10
            );

            args.push(
                "-x",
                "--audio-format",
                "mp3",
                "--audio-quality",
                bitrate + "K"
            );
        }

        args.push(url.trim());

        console.log("Starting yt-dlp...");
        console.log("Arguments:", args);

        const ytDlp = spawn(
            "py",
            [
                "-m",
                "yt_dlp",
                ...args
            ],
            {
                windowsHide: true
            }
        );

        let errorOutput = "";

        ytDlp.stdout.on(
            "data",
            data => {
                console.log(
                    "yt-dlp:",
                    data.toString()
                );
            }
        );

        ytDlp.stderr.on(
            "data",
            data => {
                const message =
                    data.toString();

                errorOutput += message;

                console.log(
                    "yt-dlp:",
                    message
                );
            }
        );

        ytDlp.on(
            "error",
            error => {
                console.error(
                    "yt-dlp process error:",
                    error.message
                );

                if (!res.headersSent) {
                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to start yt-dlp",
                        error:
                            error.message
                    });
                }
            }
        );

        ytDlp.on(
            "close",
            code => {

                console.log(
                    "yt-dlp process closed. Code:",
                    code
                );

                if (code !== 0) {
                    console.error(
                        "yt-dlp download failed"
                    );

                    console.error(
                        errorOutput
                    );

                    if (!res.headersSent) {
                        return res.status(500).json({
                            success: false,
                            message:
                                "Download failed",
                            error:
                                errorOutput
                        });
                    }

                    return;
                }

                const files =
                    fs.readdirSync(
                        tempDirectory
                    );

                const downloadedFile =
                    files.find(
                        file =>
                            file.startsWith(
                                downloadId + "."
                            )
                    );

                if (!downloadedFile) {
                    console.error(
                        "Downloaded file not found"
                    );

                    if (!res.headersSent) {
                        return res.status(500).json({
                            success: false,
                            message:
                                "Downloaded file was not found"
                        });
                    }

                    return;
                }

                const filePath =
                    path.join(
                        tempDirectory,
                        downloadedFile
                    );

                console.log(
                    "Downloaded file:",
                    downloadedFile
                );

                let downloadName;

                if (format === "mp3") {
                    downloadName =
                        "video-audio.mp3";
                } else {
                    downloadName =
                        "video-" +
                        quality +
                        ".mp4";
                }

                res.download(
                    filePath,
                    downloadName,
                    error => {

                        if (error) {
                            console.error(
                                "File download error:",
                                error.message
                            );
                        }

                        fs.unlink(
                            filePath,
                            () => {}
                        );
                    }
                );
            }
        );

    } catch (error) {

        console.error(
            "Download error:",
            error
        );

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message:
                    "Unable to download media"
            });
        }

        next(error);
    }
}

/* =========================
   EXPORT
========================= */

module.exports = {
    analyzeLocalMedia,
    uploadMedia,
    getMediaOptions,
    downloadMedia,
    analyzeYouTube,
    downloadFromUrl
};