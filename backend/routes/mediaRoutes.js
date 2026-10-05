const express = require("express");
const multer = require("multer");
const path = require("path");

const {
    validateMediaUrl
} = require("../utils/urlValidator");

const {
    analyzeLocalMedia,
    uploadMedia,
    getMediaOptions,
    downloadMedia,
    analyzeYouTube,
    downloadFromUrl
} = require("../controllers/mediaController");

const router = express.Router();

/* =========================
   TEMP DIRECTORY
========================= */

const tempDirectory = path.resolve(
    __dirname,
    "../temp"
);

/* =========================
   MULTER STORAGE
========================= */

const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {
            cb(
                null,
                tempDirectory
            );
        },

        filename: (
            req,
            file,
            cb
        ) => {

            const extension =
                path.extname(
                    file.originalname
                );

            const uniqueName =
                `upload_${Date.now()}${extension}`;

            cb(
                null,
                uniqueName
            );
        }
    });

/* =========================
   MULTER UPLOAD
========================= */

const upload = multer({

    storage,

    limits: {
        fileSize:
            100 * 1024 * 1024
    },

    fileFilter: (
        req,
        file,
        cb
    ) => {

        const allowedExtensions = [
            ".mp4",
            ".mov",
            ".mkv",
            ".webm",
            ".avi",
            ".mp3",
            ".wav",
            ".m4a"
        ];

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();

        if (
            !allowedExtensions.includes(
                extension
            )
        ) {
            return cb(
                new Error(
                    "Unsupported media file type"
                )
            );
        }

        cb(null, true);
    }
});

/* =========================
   HEALTH CHECK
========================= */

router.get(
    "/health",
    (req, res) => {

        res.json({
            success: true,
            message:
                "Media API is working"
        });

    }
);

/* =========================
   GENERIC URL ANALYZE
========================= */

router.post(
    "/analyze",
    (req, res) => {

        const { url } =
            req.body;

        const validation =
            validateMediaUrl(url);

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message:
                    validation.message
            });
        }

        res.json({
            success: true,
            message:
                "URL validated successfully",
            url
        });

    }
);

/* =========================
   UPLOAD MEDIA
========================= */

router.post(
    "/upload",
    upload.single("media"),
    uploadMedia
);

/* =========================
   ANALYZE LOCAL FILE
========================= */

router.post(
    "/analyze-file",
    analyzeLocalMedia
);

/* =========================
   GET MEDIA OPTIONS
========================= */

router.post(
    "/options",
    getMediaOptions
);

/* =========================
   DOWNLOAD LOCAL MEDIA
========================= */

router.get(
    "/download/:filename",
    downloadMedia
);

/* =========================
   YOUTUBE METADATA
========================= */

router.post(
    "/analyze-youtube",
    analyzeYouTube
);

/* =========================
   DOWNLOAD MEDIA FROM URL
========================= */

router.post(
    "/download",
    downloadFromUrl
);

/* =========================
   EXPORT
========================= */

module.exports = router;