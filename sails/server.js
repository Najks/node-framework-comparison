const Sails = require('sails').constructor;
const path = require('path');
const fs = require('fs');

const sailsApp = new Sails();

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

sailsApp.lift({
  port: process.env.PORT || 3002,
  host: process.env.HOST || '0.0.0.0',
  environment: 'production',
  log: { level: 'silent' },
  hooks: {
    grunt: false,
    sockets: false,
    pubsub: false,
    blueprints: false,
    csrf: false,
    cors: false,
    session: false,
    views: false,
    i18n: false
  },
  routes: {
    'GET /': function(req, res) {
      res.type('application/json').send({hello: 'world'});
    },
    'GET /json': function(req, res) {
      res.type('application/json').send({hello: 'world'});
    },
    'GET /nested': function(req, res) {
      res.type('application/json').send({
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
    },

    // Serve Sample-report.pdf (2457 KB)
    'GET /pdf/1': function(req, res) {
      try {
        const filePath = path.join(uploadsDir, 'Sample-report.pdf');
        
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'Sample-report.pdf not found' });
        }

        const stats = fs.statSync(filePath);
        
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Length', stats.size);
        res.set('Content-Disposition', 'inline; filename="Sample-report.pdf"');
        res.set('Cache-Control', 'public, max-age=3600');
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to serve Sample-report.pdf',
          details: error.message 
        });
      }
    },

    // Serve Large-doc.pdf (37686 KB)
    'GET /pdf/2': function(req, res) {
      try {
        const filePath = path.join(uploadsDir, 'Large-doc.pdf');
        
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'Large-doc.pdf not found' });
        }

        const stats = fs.statSync(filePath);
        
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Length', stats.size);
        res.set('Content-Disposition', 'inline; filename="Large-doc.pdf"');
        res.set('Cache-Control', 'public, max-age=3600');
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to serve Large-doc.pdf',
          details: error.message 
        });
      }
    },

    // Serve Small WebP image (500 KB)
    'GET /webp/1': function(req, res) {
      try {
        const filePath = path.join(uploadsDir, 'sample-image.webP');
        
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'sample-image.webp not found' });
        }

        const stats = fs.statSync(filePath);
        
        res.set('Content-Type', 'image/webp');
        res.set('Content-Length', stats.size);
        res.set('Content-Disposition', 'inline; filename="sample-image.webp"');
        res.set('Cache-Control', 'public, max-age=3600');
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to serve sample-image.webp',
          details: error.message 
        });
      }
    },

    // Serve Large WebP image (2000 KB)
    'GET /webp/2': function(req, res) {
      try {
        const filePath = path.join(uploadsDir, 'large-image.webp');
        
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'large-image.webp not found' });
        }

        const stats = fs.statSync(filePath);
        
        res.set('Content-Type', 'image/webp');
        res.set('Content-Length', stats.size);
        res.set('Content-Disposition', 'inline; filename="large-image.webp"');
        res.set('Cache-Control', 'public, max-age=3600');
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to serve large-image.webp',
          details: error.message 
        });
      }
    },
  }
}, (err) => {
  if (err) {
    console.error('Failed to start Sails app:', err);
    process.exit(1);
  }
  console.log('Sails server running on http://localhost:3002');
});