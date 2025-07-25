const restify = require('restify');
const path = require('path');
const fs = require('fs');

const server = restify.createServer({
  name: 'restify-server',
  version: '1.0.0'
});

server.use(restify.plugins.bodyParser());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

server.get('/', (req, res, next) => {
  res.send({ hello: 'world' });
  return next();
});

server.get('/json', (req, res, next) => {
  res.send({ hello: 'world' });
  return next();
});

server.get('/nested', (req, res, next) => {
  res.send({
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
  return next();
});

// Serve Sample-report.pdf (2457 KB)
server.get('/pdf/1', (req, res, next) => {
  try {
    const filePath = path.join(uploadsDir, 'Sample-report.pdf');
    
    if (!fs.existsSync(filePath)) {
      res.send(404, { error: 'Sample-report.pdf not found' });
      return next();
    }

    const stats = fs.statSync(filePath);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stats.size);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    res.send(500, { 
      error: 'Failed to serve Sample-report.pdf',
      details: error.message 
    });
    return next();
  }
});

// Serve Large-doc.pdf (37686 KB)
server.get('/pdf/2', (req, res, next) => {
  try {
    const filePath = path.join(uploadsDir, 'Large-doc.pdf');
    
    if (!fs.existsSync(filePath)) {
      res.send(404, { error: 'Large-doc.pdf not found' });
      return next();
    }

    const stats = fs.statSync(filePath);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stats.size);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    res.send(500, { 
      error: 'Failed to serve Large-doc.pdf',
      details: error.message 
    });
    return next();
  }
});

// Serve Small WebP image (500 KB)
server.get('/webp/1', (req, res, next) => {
  try {
    const filePath = path.join(uploadsDir, 'sample-image.webp');
    
    if (!fs.existsSync(filePath)) {
      res.send(404, { error: 'sample-image.webp not found' });
      return next();
    }

    const stats = fs.statSync(filePath);
    
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Length', stats.size);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    res.send(500, { 
      error: 'Failed to serve sample-image.webp',
      details: error.message 
    });
    return next();
  }
});

// Serve Large WebP image (2000 KB)
server.get('/webp/2', (req, res, next) => {
  try {
    const filePath = path.join(uploadsDir, 'large-image.webp');
    
    if (!fs.existsSync(filePath)) {
      res.send(404, { error: 'large-image.webp not found' });
      return next();
    }

    const stats = fs.statSync(filePath);
    
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Length', stats.size);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    res.send(500, { 
      error: 'Failed to serve large-image.webp',
      details: error.message 
    });
    return next();
  }
});

const port = process.env.PORT || 3003;
const host = process.env.HOST || '0.0.0.0';

server.listen(port, host, () => {
  console.log('Restify server running on http://localhost:3003');
});