const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const mediaRoutes = require("./routes/mediaRoutes");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Video Downloader Backend is running"
    });
});

app.use("/api/media", mediaRoutes);

/* Error Middleware */
app.use((err, req, res, next) => {
    console.error(err.message);

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "File size must be less than 100 MB"
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Backend running on http://localhost:${PORT}`
    );
});