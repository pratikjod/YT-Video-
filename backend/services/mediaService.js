const { execFile } = require("child_process");

const ffprobePath = "ffprobe";

function analyzeMedia(filePath) {
    return new Promise((resolve, reject) => {
        execFile(
            ffprobePath,
            [
                "-v", "error",
                "-show_entries",
                "format=duration,format_name",
                "-show_entries",
                "stream=index,codec_type,codec_name,width,height",
                "-of",
                "json",
                filePath
            ],
            (error, stdout, stderr) => {
                if (error) {
                    return reject(new Error(stderr || error.message));
                }

                try {
                    const data = JSON.parse(stdout);

                    resolve({
                        format: data.format || {},
                        streams: data.streams || []
                    });
                } catch (parseError) {
                    reject(parseError);
                }
            }
        );
    });
}

module.exports = {
    analyzeMedia
};