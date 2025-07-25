const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Disable X-Powered-By header for performance
app.disable('x-powered-by');

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Root endpoint
app.get('/', (req, res) => {
  res
    .type('application/json')
    .send({ hello: 'world' });
});

// Static Hello World route for performance testing
app.get('/json', (req, res) => {
  res
    .type('application/json')
    .send({ hello: 'world' });
});

app.get('/nested', (req, res) => {
  res.json({
    user: {
      name: 'John',
      age: 30,
      lastName: 'Doe',
      address: {
        country: 'Slovenia',
        city: 'Ljubljana',
        postal: 1000
      },
      hobbies: ['cycling', 'reading']
    }
  });
});

// Serve Sample-report.pdf (2457 KB)
app.get('/pdf/1', (req, res) => {
  try {
    const filePath = path.join(uploadsDir, 'Sample-report.pdf');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Sample-report.pdf not found' });
    }

    const stats = fs.statSync(filePath);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stats.size);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to serve Sample-report.pdf',
      details: error.message 
    });
  }
});

// Serve Large-doc.pdf (37686 KB)
app.get('/pdf/2', (req, res) => {
  try {
    const filePath = path.join(uploadsDir, 'Large-doc.pdf');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Large-doc.pdf not found' });
    }

    const stats = fs.statSync(filePath);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stats.size);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to serve Large-doc.pdf',
      details: error.message 
    });
  }
});

// Serve Small WebP image (500 KB)
app.get('/webp/1', (req, res) => {
  try {
    const filePath = path.join(uploadsDir, 'sample-image.webp');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'sample-image.webp not found' });
    }

    const stats = fs.statSync(filePath);
    
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Length', stats.size);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to serve sample-image.webp',
      details: error.message 
    });
  }
});

// Serve Large WebP image (2000 KB)
app.get('/webp/2', (req, res) => {
  try {
    const filePath = path.join(uploadsDir, 'large-image.webp');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'large-image.webp not found' });
    }

    const stats = fs.statSync(filePath);
    
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Length', stats.size);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to serve large-image.webp',
      details: error.message 
    });
  }
});

// Start the server
const port = process.env.PORT || 3001;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Express server running on http://${host}:${port}`);
});