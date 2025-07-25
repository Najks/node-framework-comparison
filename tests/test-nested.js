const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:3000/nested',
  connections: 100,
  duration: 30,
  pipelining: 1,
  timeout: 10
});

autocannon.track(instance, { renderLatencyTable: true });
instance.on('done', (result) => {

});

instance.on('error', (err) => {
  console.error('❌ Autocannon Error:', err.message);
});