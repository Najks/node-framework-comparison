const restify = require('restify');

const server = restify.createServer({
  name: 'restify-server',
  version: '1.0.0'
});

server.use(restify.plugins.bodyParser());

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

const port = process.env.PORT || 3003;
const host = process.env.HOST || '0.0.0.0';

server.listen(port, host, () => {
  console.log('Restify server running on http://localhost:3003');
});