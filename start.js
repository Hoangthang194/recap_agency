// start.js
const { spawn } = require('child_process');

const child = spawn('npx', ['next', 'start', '-p', '3000'], {
  shell: true,        // bắt shell để chạy trên Windows
  stdio: 'inherit',   // hiện logs trực tiếp
});

child.on('close', (code) => {
  console.log(`Next.js exited with code ${code}`);
});
