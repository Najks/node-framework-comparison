'use strict'

const fastify = require('fastify')()
const schema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: {
            type: 'string'
          }
        }
      }
    }
  }
}

fastify.get('/json', schema, function (_req, reply) {
  reply.send({ hello: 'world' })
})

const schema2 = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              age: { type: 'number' },
              lastName: { type: 'string' },
              address: {
                type: 'object',
                properties: {
                  country: { type: 'string' },
                  city: { type: 'string' },
                  postal: { type: 'number' }
                }
              },
              hobbies: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          },
        }
      }
    }
  }
}

fastify.get('/nested', schema2, function (_req, reply) {
  reply.send({
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
  })
})


fastify.listen({ port: 3000, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('Server listening at', address);
})