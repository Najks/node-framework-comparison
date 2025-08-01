const Sails = require('sails').constructor;
const sailsApp = new Sails();

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
  }
}, (err) => {
  if (err) {
    console.error('Failed to start Sails app:', err);
    process.exit(1);
  }
  console.log('Sails server running on http://localhost:3002');
});