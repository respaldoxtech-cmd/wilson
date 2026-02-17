const mongoose = require('mongoose');
const dns = require('dns');

const uri = 'mongodb+srv://w:ender1@w.tssdudb.mongodb.net/?appName=w';

console.log('🔍 Testing DNS Resolution for: _mongodb._tcp.w.tssdudb.mongodb.net');
dns.resolveSrv('_mongodb._tcp.w.tssdudb.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('❌ DNS SRV Lookup Failed:', err.code);
        console.log('   (This means the hostname is incorrect or does not exist)');
    } else {
        console.log('✅ DNS SRV Records found:', addresses);
    }

    console.log('\n--- Attempting Mongoose Connection ---');
    mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
        .then(() => {
            console.log('✅ Connected successfully!');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ Mongoose Connection Failed:');
            console.error(`   Code: ${err.code}`);
            console.error(`   Syscall: ${err.syscall}`);
            console.error(`   Hostname: ${err.hostname}`);
            process.exit(1);
        });
});
