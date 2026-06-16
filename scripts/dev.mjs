import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const isWindows = process.platform === 'win32';
const nodeBin = process.execPath;
const processes = [];

const rootDir = process.cwd();
const serverDir = join(rootDir, 'server');
const clientDir = join(rootDir, 'client');
const viteBin = join(clientDir, 'node_modules', 'vite', 'bin', 'vite.js');

if (!existsSync(viteBin)) {
  console.error('Missing client dependencies. Run "npm install" inside the client folder first.');
  process.exit(1);
}

start('server', nodeBin, ['server.js'], serverDir);
start('client', nodeBin, [viteBin, ...process.argv.slice(2)], clientDir);

process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);
process.on('exit', stopAll);

function start(name, command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: false,
    windowsHide: true,
  });

  processes.push(child);

  child.on('exit', (code, signal) => {
    if (signal || code === 0) {
      return;
    }

    console.error(`${name} exited with code ${code}.`);
    stopAll();
    process.exit(code);
  });
}

function stopAll() {
  for (const child of processes) {
    if (child.killed || child.exitCode !== null) {
      continue;
    }

    if (isWindows) {
      spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      child.kill('SIGINT');
    }
  }
}
