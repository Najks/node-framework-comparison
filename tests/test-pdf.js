// test-pdf.js
const autocannon = require('autocannon');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing PDF upload...\n');

const smallPdfPath = path.join(__dirname, 'test-files', 'sample-report.pdf');
const smallPdfBuffer = fs.readFileSync(smallPdfPath);

const smallFileInstance = autocannon({
  url: 'http://localhost:3000/upload',
  method: 'POST',
  connections: 5,
  duration: 15,
  pipelining: 1,
  timeout: 15,
  setupClient: (client) => {
    const form = new FormData();
    form.append('file', smallPdfBuffer, {
      filename: 'sample-report.pdf',  // Fixed filename
      contentType: 'application/pdf'
    });
    
    client.setHeaders(form.getHeaders());
    client.setBody(form.getBuffer());
  }
});

autocannon.track(smallFileInstance, { renderLatencyTable: true });

smallFileInstance.on('done', (result) => {
  console.log('\n📊 PDF UPLOAD RESULTS:');
  console.log(`✅ Upload RPS: ${result.requests.average.toFixed(2)}`);
  console.log(`⚡ Avg Latency: ${result.latency.average.toFixed(0)}ms`);
  console.log(`❌ Errors: ${result.errors}`);
  console.log(`⏱️  Timeouts: ${result.timeouts}`);
  
  checkUploadedFiles(result);
});

smallFileInstance.on('error', (err) => {
  console.error('❌ Error:', err.message);
});

function checkUploadedFiles(result) {
  const uploadsDir = path.join(__dirname, '..', 'fastify', 'uploads');
  
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    console.log(`\n📁 Files in uploads: ${files.length}`);
    console.log('📋 Files:', files.slice(0, 5));
    
    // Calculate total size
    let totalSize = 0;
    files.forEach(file => {
      totalSize += fs.statSync(path.join(uploadsDir, file)).size;
    });
    console.log(`💾 Total disk usage: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    console.log(`🎯 Total requests sent: ${result.requests.total}`);
  }
}