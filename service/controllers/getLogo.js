const path = require("path");
const { minioClient } = require("../minioClient");

const BUCKET_NAME = "logo";
const OBJECT_NAME = "logo";

const MIME_MAP = {
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".webp": "image/webp",
  ".bmp":  "image/bmp",
  ".ico":  "image/x-icon",
  ".tiff": "image/tiff",
  ".tif":  "image/tiff",
  ".avif": "image/avif",
};

async function getLogo(req, res) {
  try {
    const stat = await minioClient.statObject(BUCKET_NAME, OBJECT_NAME);

    const contentType =
      stat.metaData["content-type"] ||
      MIME_MAP[path.extname(OBJECT_NAME).toLowerCase()] ||
      "image/png";

    const stream = await minioClient.getObject(BUCKET_NAME, OBJECT_NAME);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(404).send("Logo not found");
  }
}

module.exports = { getLogo };