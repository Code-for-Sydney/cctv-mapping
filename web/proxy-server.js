import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/camera-proxy/:path(*)', async (req, res) => {
  const imagePath = req.params.path;
  const url = `https://webcams.transport.nsw.gov.au/${imagePath}`;
  console.log(`Fetching: ${url}`);
  
  try {
    const response = await axios({
      url,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.livetraffic.com/',
        'Origin': 'https://www.livetraffic.com',
      },
      responseType: 'arraybuffer',
    });
    
    console.log('Content-Type:', response.headers['content-type']);
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.send(response.data);
  } catch (e) {
    console.error('Proxy error:', e.message);
    res.status(500).send('Failed to fetch image');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});