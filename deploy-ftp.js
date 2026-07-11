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
  port: parseInt(process.env.FTP_PORT || '21'),
  secure: process.env.FTP_SECURE === 'true' ? true : (process.env.FTP_SECURE === 'implicit' ? 'implicit' : false),
  secureOptions: { rejectUnauthorized: false },
};

const localDir = path.resolve(process.env.LOCAL_DIR || 'dist');
const remoteDir = process.env.REMOTE_DIR || 'public_html/';

if (!config.host || config.host === '') {
  console.error('ERROR: HOSTINGER_FTP_HOST is empty or not set. Check GitHub Secrets.');
  process.exit(1);
}
if (!config.user || config.user === '') {
  console.error('ERROR: HOSTINGER_FTP_USER is empty or not set. Check GitHub Secrets.');
  process.exit(1);
}
if (!config.password || config.password === '') {
  console.error('ERROR: HOSTINGER_FTP_PASSWORD is empty or not set. Check GitHub Secrets.');
  process.exit(1);
}

console.log('FTP Configuration:');
console.log('  Host:', config.host);
console.log('  User:', config.user);
console.log('  Local dir:', localDir);
console.log('  Remote dir:', remoteDir);
console.log('');

async function deploy() {
  // Try plain FTP first, then FTPS
  const configs = [
    { ...config, secure: false, port: config.port || 21 },
    { ...config, secure: true, port: config.port || 21 },
  ];

  for (const cfg of configs) {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    const label = cfg.secure ? 'explicit FTPS' : 'plain FTP';
    try {
      console.log('Trying', label, 'on port', cfg.port, '...');
      await client.access(cfg);
      console.log('Connected via', label, '! Current remote directory:', await client.pwd());

      console.log('Ensuring remote directory exists:', remoteDir);
      await client.ensureDir(remoteDir);

      console.log('Clearing remote directory...');
      await client.clearWorkingDir();

      console.log('Uploading from', localDir, 'to', remoteDir);
      await client.uploadFromDir(localDir);
      console.log('');
      console.log('=== Deploy complete ===');
      client.close();
      return;
    } catch (err) {
      console.log(label, 'failed:', err.message.substring(0, 100));
      client.close();
    }
  }

  console.error('');
  console.error('========================================');
  console.error('DEPLOY FAILED — all connection methods exhausted');
  console.error('1. Check HOSTINGER_FTP_HOST — should be ftp.yourdomain.com');
  console.error('2. Check HOSTINGER_FTP_USER — from hPanel > FTP Accounts');
  console.error('3. Check HOSTINGER_FTP_PASSWORD — exact password from FTP account');
  console.error('4. Verify FTP is enabled in Hostinger hPanel');
  console.error('========================================');
  process.exit(1);
}

deploy();
