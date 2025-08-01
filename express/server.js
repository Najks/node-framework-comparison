const express = require('express');
const app = express();

app.disable('x-powered-by');

app.get('/', (req, res) => {
  res
    .type('application/json')
    .send({ hello: 'world' });
});

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

const port = process.env.PORT || 3001;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Express server running on http://${host}:${port}`);
});