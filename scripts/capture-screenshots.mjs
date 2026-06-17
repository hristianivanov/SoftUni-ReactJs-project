import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(new URL('../client/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const rootDir = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const screenshotDir = join(rootDir, 'docs', 'screenshots');
const nodeBin = process.execPath;
const devProcess = spawn(nodeBin, ['scripts/dev.mjs'], {
  cwd: rootDir,
  stdio: 'inherit',
  windowsHide: true,
});

let browser;

try {
  await waitForUrl('http://localhost:5173');
  await runSeed();
  await mkdir(screenshotDir, { recursive: true });

  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await capture(page, '/', 'home-desktop.jpg');
  await capture(page, '/articles', 'articles-desktop.jpg');

  await page.goto('http://localhost:5173/articles', { waitUntil: 'networkidle' });
  await page.locator('article a').first().click();
  await waitForReadyPage(page);
  await screenshot(page, 'article-detail-desktop.jpg');

  await login(page);
  await capture(page, '/my-articles', 'my-articles-desktop.jpg');
  await capture(page, '/articles/create', 'article-editor-desktop.jpg');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /toggle navigation menu/i }).click();
  await page.getByRole('navigation', { name: /mobile navigation/i }).waitFor();
  await screenshot(page, 'mobile-menu.jpg');
} finally {
  await browser?.close();
  stopDevProcess();
}

async function runSeed() {
  await new Promise((resolve, reject) => {
    const seed = spawn(nodeBin, ['scripts/seed-dev.mjs'], {
      cwd: rootDir,
      stdio: 'inherit',
      windowsHide: true,
    });

    seed.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Seed script exited with code ${code}`));
      }
    });
  });
}

async function capture(page, path, fileName) {
  await page.goto(`http://localhost:5173${path}`, { waitUntil: 'networkidle' });
  await waitForReadyPage(page);
  await screenshot(page, fileName);
}

async function screenshot(page, fileName) {
  await waitForImages(page);
  await page.screenshot({
    path: join(screenshotDir, fileName),
    type: 'jpeg',
    quality: 84,
    fullPage: false,
  });
}

async function login(page) {
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.getByLabel(/email/i).fill('demo@local.test');
  await page.getByLabel(/^password$/i).fill('demo123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('http://localhost:5173/');
}

async function waitForReadyPage(page) {
  await page.locator('main').waitFor();
  await page.waitForLoadState('networkidle');
}

async function waitForImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(images.map((image) => {
      if (image.complete) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
    }));
  });
}

async function waitForUrl(url) {
  for (let index = 0; index < 60; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function stopDevProcess() {
  if (!devProcess || devProcess.killed) {
    return;
  }

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(devProcess.pid), '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true,
    });
  } else {
    devProcess.kill('SIGINT');
  }
}
