const autocannon = require('autocannon');
const { spawn } = require('child_process');
const pidusage = require('pidusage');

const config = {
    script: '../fastify/server.js',
    url: 'http://localhost:3000/json',
    port: 3000
};

async function test() {
    // Start server
    const server = spawn('node', [config.script], { 
        env: { PORT: config.port }, 
        stdio: 'pipe' 
    });
    
    await new Promise(resolve => {
        server.stdout.on('data', data => {
            const output = data.toString();
            if (output.includes('SERVER_LISTENING_READY') || output.includes('running') || output.includes('127.0.0.1')) {
                resolve();
            }
        });
    });

    // Monitor resources
    const stats = [];
    const monitor = setInterval(async () => {
        try {
            const stat = await pidusage(server.pid);
            stats.push({ cpu: stat.cpu, mem: stat.memory / 1024 / 1024 });
        } catch {}
    }, 500);

    // Run test with same params as: autocannon -c 100 -d 40 -p 10 localhost:3000
    const result = await new Promise(resolve => {
        const instance = autocannon({ 
            url: config.url, 
            connections: 100,    // -c 100
            duration: 40,        // -d 40
            pipelining: 10       // -p 10
        });
        autocannon.track(instance);
        instance.on('done', resolve);
    });

    // Stop monitoring
    clearInterval(monitor);
    server.kill();

    // Results
    const avgCpu = stats.reduce((a,b) => a + b.cpu, 0) / stats.length;
    const avgMem = stats.reduce((a,b) => a + b.mem, 0) / stats.length;
    
    console.log(`\n📊 RPS: ${result.requests.average.toFixed(0)}`);
    console.log(`⚡ Latency: ${result.latency.average.toFixed(0)}ms`);
    console.log(`💾 CPU: ${avgCpu.toFixed(1)}%, Memory: ${avgMem.toFixed(0)}MB`);
}

test().catch(console.error);