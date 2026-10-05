import axios from "axios";

/* =========================
   API CONFIG
========================= */

const API = axios.create({
    baseURL:
        "http://localhost:5000/api"
});

/* =========================
   ANALYZE MEDIA FILE
========================= */

export const analyzeMediaFile =
    async (filename) => {

        const response =
            await API.post(
                "/media/analyze-file",
                {
                    filename
                }
            );

        return response.data;
    };

/* =========================
   UPLOAD MEDIA FILE
========================= */

export const uploadMediaFile =
    async (file) => {

        const formData =
            new FormData();

        formData.append(
            "media",
            file
        );

        const response =
            await API.post(
                "/media/upload",
                formData
            );

        return response.data;
    };

/* =========================
   GET MEDIA OPTIONS
========================= */

export const getMediaOptions =
    async (filename) => {

        const response =
            await API.post(
                "/media/options",
                {
                    filename
                }
            );

        return response.data;
    };

/* =========================
   CONVERT MEDIA
========================= */

export const convertMediaFile =
    async ({
        filename,
        format,
        resolution
    }) => {

        const response =
            await API.post(
                "/media/convert",
                {
                    filename,
                    format,
                    resolution
                }
            );

        return response.data;
    };

/* =========================
   ANALYZE YOUTUBE URL
========================= */

export const analyzeYouTubeUrl =
    async (url) => {

        const response =
            await API.post(
                "/media/analyze-youtube",
                {
                    url
                }
            );

        return response.data;
    };





export const downloadMediaFromUrl = async ({
    url,
    format = "mp4",
    quality = "720p"
}) => {
    const response = await API.post(
        "/media/download",
        {
            url,
            format,
            quality
        },
        {
            responseType: "blob"
        }
    );

    return response;
};