const autocannon = require('autocannon');
const { spawn } = require('child_process');
const pidusage = require('pidusage');
const fs = require('fs');

const frameworks = [
    { name: 'Express', dir: '../express', port: 3001, url: 'http://localhost:3001/json' },
    { name: 'Fastify', dir: '../fastify', port: 3000, url: 'http://localhost:3000/json' },
    { name: 'Sails', dir: '../sails', port: 3002, url: 'http://localhost:3002/json' },
    { name: 'Restify', dir: '../restify', port: 3003, url: 'http://localhost:3003/json' },
    { name: 'Koa', dir: '../koa', port: 3004, url: 'http://localhost:3004/json' },
    { name: 'NestJS', dir: '../nest/nest', port: 3005, url: 'http://localhost:3005/json' }
];

async function testFramework(framework) {
    console.log(`Testing ${framework.name}...`);
    
    const server = spawn('npm', ['start'], {
        env: { ...process.env, PORT: framework.port },
        stdio: 'pipe',
        cwd: framework.dir,
        shell: true
    });
    
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            console.log(`❌ ${framework.name} timeout - server didn't start`);
            reject(new Error('Timeout'));
        }, 30000);
        
        server.stdout.on('data', data => {
            const output = data.toString();
            console.log(`${framework.name} stdout:`, output.trim()); // DEBUG
            
            // Širši pattern za startup detection
            if (output.includes('running') || 
                output.includes('listening') || 
                output.includes('SERVER_LISTENING_READY') ||
                output.includes('started') ||
                output.includes('3000') ||
                output.includes('localhost')) {
                clearTimeout(timeout);
                resolve();
            }
        });
        
        server.stderr.on('data', data => {
            console.log(`${framework.name} stderr:`, data.toString().trim()); // DEBUG
        });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        const stats = [];
        const monitor = setInterval(async () => {
            try {
                const stat = await pidusage(server.pid);
                stats.push({ mem: stat.memory / 1024 / 1024 });
            } catch {}
        }, 500);

        const result = await new Promise(resolve => {
            const instance = autocannon({ 
                url: framework.url,
                connections: 100,
                duration: 40,
                pipelining: 10
            });
            instance.on('done', resolve);
        });

        clearInterval(monitor);
        
        const avgMem = stats.length > 0 ? stats.reduce((a,b) => a + b.mem, 0) / stats.length : 0;
        
        return {
            framework: framework.name,
            rps: Math.round(result.requests.average),
            throughput: Math.round(result.throughput.average / 1024),
            memory: Math.round(avgMem),
            latency: Math.round(result.latency.average * 10) / 10
        };
        
    } finally {
        server.kill();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function runAllTests() {
    const results = [];
    
    for (const framework of frameworks) {
        try {
            const result = await testFramework(framework);
            results.push(result);
        } catch (error) {
            console.error(`Failed: ${framework.name} - ${error.message}`);
        }
    }
    
    console.log('\nRESULTS:');
    console.log('Framework | RPS     | KB/s    | Memory | Latency');
    console.log('----------|---------|---------|--------|--------');
    
    results
        .sort((a, b) => b.rps - a.rps)
        .forEach(r => {
            console.log(`${r.framework.padEnd(9)} | ${r.rps.toString().padStart(7)} | ${r.throughput.toString().padStart(7)} | ${r.memory.toString().padStart(6)} | ${r.latency}`);
        });

    const csv = 'Framework,RPS,Throughput_KB/s,Memory_MB,Latency_ms\n' + 
        results.map(r => `${r.framework},${r.rps},${r.throughput},${r.memory},${r.latency}`).join('\n');
    
    fs.writeFileSync(`results_${Date.now()}.csv`, csv);
    console.log('\nSaved to CSV');
}

runAllTests().catch(console.error);