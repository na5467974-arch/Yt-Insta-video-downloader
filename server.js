const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ YouTube Download API
app.get("/api/youtube", async (req, res) => {
  try {
    const videoURL = req.query.url;
    if (!ytdl.validateURL(videoURL)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const info = await ytdl.getInfo(videoURL);
    const formats = info.formats
      .filter(f => f.qualityLabel)
      .map(f => ({
        quality: f.qualityLabel,
        mimeType: f.mimeType,
        url: f.url
      }));

    res.json({ title: info.videoDetails.title, formats });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

// ✅ Instagram Download API (basic)
app.get("/api/instagram", async (req, res) => {
  try {
    const postURL = req.query.url;
    if (!postURL) return res.status(400).json({ error: "No URL provided" });

    const response = await axios.get(`https://api.instagram-downloader.io/?url=${postURL}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Instagram video" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
