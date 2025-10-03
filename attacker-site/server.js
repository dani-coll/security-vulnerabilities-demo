const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Attacker site running at http://localhost:${PORT}`);
  console.log('This site will attempt to exploit the CORS vulnerability');
});