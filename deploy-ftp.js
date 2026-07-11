/**
 * deploy-ftp.js — Deploy dist/ to Hostinger via FTP
 * Uses basic-ftp (same library as SamKirkland/FTP-Deploy-Action).
 */
const ftp = require('basic-ftp');
const path = require('path');

const config = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASS,
  secure: false,
};

const localDir = path.resolve(process.env.LOCAL_DIR || 'dist');
const remoteDir = process.env.REMOTE_DIR || 'public_html/';

if (!config.host || !config.user || !config.password) {
  console.error('ERROR: FTP_HOST, FTP_USER, and FTP_PASS environment variables are required.');
  process.exit(1);
}

console.log('FTP Configuration:');
console.log('  Host:', config.host);
console.log('  User:', config.user);
console.log('  Local dir:', localDir);
console.log('  Remote dir:', remoteDir);
console.log('');

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('Connecting...');
    await client.access(config);
    console.log('Connected. Current remote directory:', await client.pwd());

    console.log('Ensuring remote directory exists:', remoteDir);
    await client.ensureDir(remoteDir);

    console.log('Clearing remote directory...');
    await client.clearWorkingDir();

    console.log('Uploading from', localDir, 'to', remoteDir);
    await client.uploadFromDir(localDir);
    console.log('');
    console.log('=== Deploy complete ===');
  } catch (err) {
    console.error('');
    console.error('========================================');
    console.error('DEPLOY FAILED');
    console.error('========================================');
    console.error('Message:', err.message);
    console.error('Code:', err.code || 'none');
    console.error('Stack:', err.stack || 'none');
    console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    console.error('========================================');
    process.exit(1);
  }
  client.close();
}

deploy();
