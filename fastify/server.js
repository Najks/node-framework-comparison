'use strict'

const fastify = require('fastify')()
const path = require('path')
const fs = require('fs')

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

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

// Serve Sample-report.pdf (2457 KB)
fastify.get('/pdf/1', async function (req, reply) {
  try {
    const filePath = path.join(uploadsDir, 'Sample-report.pdf')
    
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ error: 'Sample-report.pdf not found' })
    }

    const stats = fs.statSync(filePath)
    
    reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Length', stats.size)
    
    const fileStream = fs.createReadStream(filePath)
    return reply.send(fileStream)

  } catch (error) {
    reply.status(500).send({ 
      error: 'Failed to serve Sample-report.pdf',
      details: error.message 
    })
  }
})

// Serve Large-doc.pdf (37686 KB)
fastify.get('/pdf/2', async function (req, reply) {
  try {
    const filePath = path.join(uploadsDir, 'Large-doc.pdf')
    
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ error: 'Large-doc.pdf not found' })
    }

    const stats = fs.statSync(filePath)
    
    reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Length', stats.size)
    
    const fileStream = fs.createReadStream(filePath)
    return reply.send(fileStream)

  } catch (error) {
    reply.status(500).send({ 
      error: 'Failed to serve Large-doc.pdf',
      details: error.message 
    })
  }
})

// Serve Small WebP image (500 KB)
fastify.get('/webp/1', async function (req, reply) {
  try {
    const filePath = path.join(uploadsDir, 'sample-image.webp')
    
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ error: 'sample-image.webp not found' })
    }

    const stats = fs.statSync(filePath)
    
    reply
      .header('Content-Type', 'image/webp')
      .header('Content-Length', stats.size)
    
    const fileStream = fs.createReadStream(filePath)
    return reply.send(fileStream)

  } catch (error) {
    reply.status(500).send({ 
      error: 'Failed to serve sample-image.webp',
      details: error.message 
    })
  }
})

// Serve Large WebP image (2000 KB)
fastify.get('/webp/2', async function (req, reply) {
  try {
    const filePath = path.join(uploadsDir, 'large-image.webp')
    
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ error: 'large-image.webp not found' })
    }

    const stats = fs.statSync(filePath)
    
    reply
      .header('Content-Type', 'image/webp')
      .header('Content-Length', stats.size)
    
    const fileStream = fs.createReadStream(filePath)
    return reply.send(fileStream)

  } catch (error) {
    reply.status(500).send({ 
      error: 'Failed to serve large-image.webp',
      details: error.message 
    })
  }
})

fastify.listen({ port: 3000, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('SERVER_LISTENING_READY');
})