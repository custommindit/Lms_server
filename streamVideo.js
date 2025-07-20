const { google } = require('googleapis');
const express = require('express');
const app = express();
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive']
});

app.get('/video/:fileId', async (req, res) => {
  try {
    const drive = google.drive({ version: 'v3', auth });
    const { fileId } = req.params;

    const { data } = await drive.files.get({
      fileId,
      alt: 'media'
    }, { responseType: 'stream' });

    res.setHeader('Content-Type', 'video/mp4');
    data.pipe(res);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('حدث خطأ أثناء جلب الفيديو');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});