/**
 * deploy-ftp.js — Deploy dist/ to Hostinger via FTP
 * Hostinger requires explicit FTPS (TLS on port 21).
 */
const ftp = require('basic-ftp');
const path = require('path');

const host = process.env.FTP_HOST;
const user = process.env.FTP_USER;
const password = process.env.FTP_PASS;
const remoteDir = process.env.REMOTE_DIR || 'public_html/';
const localDir = path.resolve(process.env.LOCAL_DIR || 'dist');

if (!host || host === '') {
  console.error('ERROR: HOSTINGER_FTP_HOST is empty. Check GitHub Secrets.');
  process.exit(1);
}
if (!user || user === '') {
  console.error('ERROR: HOSTINGER_FTP_USER is empty. Check GitHub Secrets.');
  process.exit(1);
}
if (!password || password === '') {
  console.error('ERROR: HOSTINGER_FTP_PASSWORD is empty. Check GitHub Secrets.');
  process.exit(1);
}

console.log('FTP Configuration:');
console.log('  Host:', host);
console.log('  User:', user);
console.log('  Remote dir:', remoteDir);
console.log('  Local dir:', localDir);
console.log('  Protocol: explicit FTPS (TLS on port 21)');
console.log('');

async function deploy() {
  const client = new ftp.Client(30000); // 30s timeout
  client.ftp.verbose = true;

  try {
    console.log('Connecting via explicit FTPS to', host, '...');
    await client.access({
      host: host,
      user: user,
      password: password,
      port: 21,
      secure: true,                    // explicit FTPS
      secureOptions: {
        rejectUnauthorized: false       // allow self-signed certs
      },
    });

    console.log('Connected! PWD:', await client.pwd());

    // Ensure we're in the right directory
    await client.ensureDir(remoteDir);
    console.log('Remote directory OK:', remoteDir);

    // Clear existing files to get a clean deploy
    console.log('Clearing old files in', remoteDir, '...');
    await client.clearWorkingDir();

    // Upload everything
    console.log('Uploading files from', localDir, '...');
    await client.uploadFromDir(localDir);
    console.log('');
    console.log('=== DEPLOY COMPLETE ===');
  } catch (err) {
    console.error('');
    console.error('========================================');
    console.error('DEPLOY FAILED');
    console.error('========================================');
    console.error('Error:', err.message);
    console.error('Code:', err.code || 'none');
    console.error('========================================');
    process.exit(1);
  }
  client.close();
}

deploy();
