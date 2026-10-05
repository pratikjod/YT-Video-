const { execFile } = require("child_process");
const path = require("path");

function runFFmpeg(args) {
    return new Promise((resolve, reject) => {
        execFile(
            "ffmpeg",
            args,
            {
                windowsHide: true
            },
            (error, stdout, stderr) => {
                if (error) {
                    console.error(
                        "FFmpeg Error:",
                        stderr
                    );

                    return reject(
                        new Error(
                            "FFmpeg conversion failed"
                        )
                    );
                }

                resolve({
                    stdout,
                    stderr
                });
            }
        );
    });
}

async function convertMedia(
    inputPath,
    outputPath,
    format,
    resolution
) {
    if (format === "mp4") {

        const resolutionMap = {
            "1080p": "1920:1080",
            "720p": "1280:720",
            "480p": "854:480",
            "360p": "640:360"
        };

        const size =
            resolutionMap[resolution];

        if (!size) {
            throw new Error(
                "Unsupported video resolution"
            );
        }

        await runFFmpeg([
            "-y",
            "-i",
            inputPath,

            "-vf",
            `scale=${size}:force_original_aspect_ratio=decrease`,

            "-c:v",
            "libx264",

            "-preset",
            "medium",

            "-crf",
            "23",

            "-c:a",
            "aac",

            "-b:a",
            "128k",

            "-movflags",
            "+faststart",

            outputPath
        ]);

        return outputPath;
    }


    if (format === "mp3") {

        await runFFmpeg([
            "-y",
            "-i",
            inputPath,

            "-vn",

            "-codec:a",
            "libmp3lame",

            "-b:a",
            "128k",

            outputPath
        ]);

        return outputPath;
    }


    throw new Error(
        "Unsupported conversion format"
    );
}

module.exports = {
    convertMedia
};