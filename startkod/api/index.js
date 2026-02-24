const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const cors = require('cors');

app.use(cors());

app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'API körs', timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, HOST, () => {
  console.log(`API lyssnar på ${HOST}:${port}`);
});
