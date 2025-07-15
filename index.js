const express = require("express");
const app = express();
const port = 8753;
const path=require('path')
const mongoose = require("mongoose");
const router = require("./src/routes/index");
const cors = require("cors");
const http = require("http");
const multer = require('multer');

const { google } = require('googleapis');

require('dotenv').config();

app.use(express.json());

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "600mb" }));
  app.use(router)
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  app.options('*', (req, res) => {
    res.sendStatus(200);
  });
  const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log("MongoDB connected: ", conn.connection.host);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };



const auth = new google.auth.GoogleAuth({
  keyFile: './service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive']
});

app.get('/video/:fileId', async (req, res) => {
  try {
    const drive = google.drive({ version: 'v3', auth });
    const { fileId } = req.params;
    const clientRange = req.headers.range;

    const driveOptions = {
      fileId,
      alt: 'media',
    };

    const headers = clientRange ? { Range: clientRange } : undefined;

    const driveRes = await drive.files.get(driveOptions, {
      responseType: 'stream',
      headers,
    });

    const contentLength = driveRes.headers.get('content-length');
    const contentRange  = driveRes.headers.get('content-range');
    const contentType   = 'video/mp4';

    if (clientRange && contentLength && contentRange) {
      // Partial stream response
      res.writeHead(206, {
        'Content-Type': contentType,
        'Content-Length': contentLength,
        'Content-Range': contentRange,
        'Accept-Ranges': 'bytes',
      });
    } else {
      // Full stream fallback
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': contentLength || '0',
        'Accept-Ranges': 'bytes',
      });
    }

    driveRes.data.pipe(res);
  } catch (err) {
    console.error('❌ Stream error:', err.message);
    res.status(500).send('حدث خطأ أثناء جلب الفيديو');
  }
});
const server = http.createServer(app);

server.setTimeout(20 * 60 * 1000);

connectDB().then(() => {
    server.listen(port, () => {
      console.log(`server is starting at port ${port}`);
    });
  });
