const { spawn } = require('child_process');
const path = require('path');

const frameworks = [
  { name: 'Fastify', dir: 'fastify', command: 'npm', args: ['start'], port: 3000 },
  { name: 'Express', dir: 'express', command: 'npm', args: ['start'], port: 3001 },
  { name: 'Sails', dir: 'sails', command: 'npm', args: ['start'], port: 3002 },
  { name: 'Restify', dir: 'restify', command: 'npm', args: ['start'], port: 3003 },
  { name: 'Koa', dir: 'koa', command: 'npm', args: ['start'], port: 3004 },
  { name: 'NestJS', dir: 'nest/nest', command: 'npm', args: ['run', 'start'], port: 3005 }
];

console.log('Starting all frameworks...\n');

frameworks.forEach(framework => {
  const child = spawn(framework.command, framework.args, {
    cwd: path.join(__dirname, framework.dir),
    stdio: 'inherit',
    shell: true
  });

  child.on('spawn', () => {
    console.log(`✅ ${framework.name} started on port ${framework.port}`);
  });

  child.on('error', (err) => {
    console.error(`❌ Failed to start ${framework.name}:`, err.message);
  });
});

console.log('\nAll frameworks launching...');
console.log('Press Ctrl+C to stop all servers');