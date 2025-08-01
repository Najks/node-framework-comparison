const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

app.on('error', (err, ctx) => {
  if (err.code !== 'ECONNABORTED' && err.code !== 'ECONNRESET') {
    console.error('Server error:', err);
  }
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.code === 'ECONNRESET') {
      return;
    }
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
    ctx.app.emit('error', err, ctx);
  }
});

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

// Apply routes
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const port = process.env.PORT || 3004;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log('Koa server running on http://localhost:3004');
});

// Handle server errors
app.on('error', (err) => {
  if (err.code !== 'ECONNABORTED' && err.code !== 'ECONNRESET') {
    console.error('Server error:', err);
  }
});

// Handle client connection errors
app.on('clientError', (err, socket) => {
  if (err.code !== 'ECONNABORTED' && err.code !== 'ECONNRESET') {
    console.error('Client error:', err);
  }
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});