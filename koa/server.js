const Koa = require('koa');
const Router = require('@koa/router');
const path = require('path');
const fs = require('fs');

const app = new Koa();
const router = new Router();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

router.get('/', async (ctx) => {
  ctx.type = 'application/json';
  ctx.body = { hello: 'world' };
});

router.get('/json', async (ctx) => {
  ctx.type = 'application/json';
  ctx.body = { hello: 'world' };
});

router.get('/nested', async (ctx) => {
  ctx.type = 'application/json';
  ctx.body = {
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
  };
});

// Serve Sample-report.pdf (2457 KB)
router.get('/pdf/1', async (ctx) => {
  try {
    const filePath = path.join(uploadsDir, 'Sample-report.pdf');
    
    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = { error: 'Sample-report.pdf not found' };
      return;
    }

    const stats = fs.statSync(filePath);
    
    ctx.set('Content-Type', 'application/pdf');
    ctx.set('Content-Length', stats.size);
    
    ctx.body = fs.createReadStream(filePath);

  } catch (error) {
    ctx.status = 500;
    ctx.body = { 
      error: 'Failed to serve Sample-report.pdf',
      details: error.message 
    };
  }
});

// Serve Large-doc.pdf (37686 KB)
router.get('/pdf/2', async (ctx) => {
  try {
    const filePath = path.join(uploadsDir, 'Large-doc.pdf');
    
    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = { error: 'Large-doc.pdf not found' };
      return;
    }

    const stats = fs.statSync(filePath);
    
    ctx.set('Content-Type', 'application/pdf');
    ctx.set('Content-Length', stats.size);
    
    ctx.body = fs.createReadStream(filePath);

  } catch (error) {
    ctx.status = 500;
    ctx.body = { 
      error: 'Failed to serve Large-doc.pdf',
      details: error.message 
    };
  }
});

// Serve Small WebP image (500 KB)
router.get('/webp/1', async (ctx) => {
  try {
    const filePath = path.join(uploadsDir, 'sample-image.webp');
    
    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = { error: 'sample-image.webp not found' };
      return;
    }

    const stats = fs.statSync(filePath);
    
    ctx.set('Content-Type', 'image/webp');
    ctx.set('Content-Length', stats.size);
    
    ctx.body = fs.createReadStream(filePath);

  } catch (error) {
    ctx.status = 500;
    ctx.body = { 
      error: 'Failed to serve sample-image.webp',
      details: error.message 
    };
  }
});

// Serve Large WebP image (2000 KB)
router.get('/webp/2', async (ctx) => {
  try {
    const filePath = path.join(uploadsDir, 'large-image.webp');
    
    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = { error: 'large-image.webp not found' };
      return;
    }

    const stats = fs.statSync(filePath);
    
    ctx.set('Content-Type', 'image/webp');
    ctx.set('Content-Length', stats.size);
    
    ctx.body = fs.createReadStream(filePath);

  } catch (error) {
    ctx.status = 500;
    ctx.body = { 
      error: 'Failed to serve large-image.webp',
      details: error.message 
    };
  }
});

// Apply routes
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const port = process.env.PORT || 3004;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log('Koa server running on http://localhost:3004');
});