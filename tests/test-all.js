const autocannon = require('autocannon');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const frameworks = [
    { name: 'Express', dir: '../express', port: 3001 },
    { name: 'Fastify', dir: '../fastify', port: 3000 },
    { name: 'Sails', dir: '../sails', port: 3002 },
    { name: 'Restify', dir: '../restify', port: 3003 },
    { name: 'Koa', dir: '../koa', port: 3004 },
    { name: 'NestJS', dir: '../nest/nest', port: 3005 }
];

const endpoints = [
    { name: 'json', path: '/json' },
    { name: 'nested', path: '/nested' }
];

const defaultConnections = [50, 100, 200];

console.log(`Installing dependencies and testing all frameworks sequentially...`);

async function installDependencies(framework) {
    console.log(`Installing dependencies for ${framework.name}...`);
    
    const frameworkPath = path.resolve(framework.dir);
    
    // Check if package.json exists
    if (!fs.existsSync(path.join(frameworkPath, 'package.json'))) {
        console.log(` No package.json found in ${framework.dir}, skipping install`);
        return;
    }
    
    return new Promise((resolve, reject) => {
        const install = spawn('npm', ['install'], {
            cwd: frameworkPath,
            stdio: 'pipe',
            shell: true
        });
        
        install.stdout.on('data', data => {
            // Suppress verbose npm output, only show important messages
            const output = data.toString();
            if (output.includes('added') || output.includes('warning') || output.includes('error')) {
                console.log(`  ${framework.name}: ${output.trim()}`);
            }
        });
        
        install.stderr.on('data', data => {
            const output = data.toString();
            if (!output.includes('npm WARN')) { // Suppress npm warnings
                console.log(`  ${framework.name} error: ${output.trim()}`);
            }
        });
        
        install.on('close', code => {
            if (code === 0) {
                console.log(`   ${framework.name} dependencies installed`);
                resolve();
            } else {
                console.log(`   ${framework.name} install failed with code ${code}`);
                reject(new Error(`npm install failed for ${framework.name}`));
            }
        });
        
        install.on('error', error => {
            console.log(`   ${framework.name} install error: ${error.message}`);
            reject(error);
        });
    });
}

async function installAllDependencies() {
    console.log('Installing dependencies for all frameworks...\n');
    
    for (const framework of frameworks) {
        try {
            await installDependencies(framework);
        } catch (error) {
            console.error(`Failed to install dependencies for ${framework.name}: ${error.message}`);
            console.log('Continuing with other frameworks...\n');
        }
    }
    
    console.log('\n Dependency installation completed!\n');
}

async function runSingleTest(server, framework, endpoint, connectionCount) {
    const url = `http://localhost:${framework.port}${endpoint.path}`;
    
    console.log(`  ${endpoint.name} ${connectionCount}c...`);
    
    // Warmup
    await new Promise(resolve => {
        const warmup = autocannon({ 
            url: url,
            connections: 5,
            duration: 2,
            pipelining: 1
        });
        warmup.on('done', resolve);
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Actual test
    const result = await new Promise(resolve => {
        const instance = autocannon({ 
            url: url,
            connections: connectionCount,
            duration: 10,
            pipelining: 10
        });
        instance.on('done', resolve);
    });
    
    return {
        framework: framework.name,
        endpoint: endpoint.name,
        connections: connectionCount,
        rps: Math.round(result.requests.average),
        throughput: Math.round(result.throughput.average / 1024),
        latency: Math.round(result.latency.average * 10) / 10
    };
}

async function testFrameworkComplete(framework) {
    console.log(`\n Testing ${framework.name}...`);
    
    // Start server once
    const server = spawn('npm', ['start'], {
        env: { ...process.env, PORT: framework.port },
        stdio: 'pipe',
        cwd: framework.dir,
        shell: true
    });
    
    // Wait for startup
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error(`${framework.name} startup timeout`));
        }, 30000);
        
        server.stdout.on('data', data => {
            const output = data.toString();
            if (output.includes('running') || 
                output.includes('listening') || 
                output.includes('SERVER_LISTENING_READY') ||
                output.includes('started') ||
                output.includes(framework.port.toString()) ||
                output.includes('localhost')) {
                clearTimeout(timeout);
                resolve();
            }
        });
        
        server.stderr.on('data', data => {
            console.log(`${framework.name} stderr:`, data.toString().trim());
        });
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const frameworkResults = [];
    
    try {
        // Test all combinations for this framework
        for (const endpoint of endpoints) {
            for (const connectionCount of defaultConnections) {
                try {
                    const result = await runSingleTest(server, framework, endpoint, connectionCount);
                    frameworkResults.push(result);
                    console.log(`    ${result.rps} RPS, ${result.latency}ms`);
                } catch (error) {
                    console.error(`     ${endpoint.name} ${connectionCount}c failed: ${error.message}`);
                }
                
                // Pause between tests
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
    } finally {
        // Kill server
        server.kill('SIGTERM');
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            server.kill('SIGKILL');
        } catch {}
        
        // Extra cleanup time
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return frameworkResults;
}

async function runAllTests() {
    // First install all dependencies
    await installAllDependencies();
    
    const allResults = [];
    
    // Test each framework completely before moving to next
    console.log('Starting performance tests...\n');
    for (const framework of frameworks) {
        try {
            const frameworkResults = await testFrameworkComplete(framework);
            allResults.push(...frameworkResults);
        } catch (error) {
            console.error(`${framework.name} failed: ${error.message}`);
        }
    }
    
    // Display results grouped by test type
    console.log('\n' + '='.repeat(60));
    console.log('='.repeat(60));
    
    for (const connectionCount of defaultConnections) {
        for (const endpoint of endpoints) {
            const results = allResults.filter(r => 
                r.connections === connectionCount && r.endpoint === endpoint.name
            );
            
            if (results.length === 0) continue;
            
            console.log(`\n${endpoint.name.toUpperCase()} - ${connectionCount} connections`);
            console.log('-'.repeat(50));
            console.log('Framework | RPS     | KB/s    | Latency');
            console.log('----------|---------|---------|--------');
            
            results
                .sort((a, b) => b.rps - a.rps)
                .forEach(r => {
                    console.log(`${r.framework.padEnd(9)} | ${r.rps.toString().padStart(7)} | ${r.throughput.toString().padStart(7)} | ${r.latency}`);
                });
        }
    }

    // Save results
    const timestamp = Date.now();
    const csvHeaders = 'Framework,Endpoint,Connections,RPS,Throughput_KB/s,Latency_ms\n';
    const csvRows = allResults.map(r => 
        `${r.framework},${r.endpoint},${r.connections},${r.rps},${r.throughput},${r.latency}`
    ).join('\n');

    const csvFile = `results_sequential_${timestamp}.csv`;
    fs.writeFileSync(csvFile, csvHeaders + csvRows);
    
    console.log(`\nResults saved to: ${csvFile}`);
    console.log(`Total tests completed: ${allResults.length}`);
}

runAllTests().catch(console.error);