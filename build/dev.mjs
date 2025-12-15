/*
 * @Author: mjh
 * @Date: 2025-08-05 19:25:14
 * @LastEditors: mjh
 * @LastEditTime: 2025-12-15 18:29:39
 * @Description:
 */
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gulpConfig = resolve(__dirname, './compiler.js');

async function run() {
  const p = exec(`npx gulp -f ${gulpConfig} buildExample --color`);
  p.stdout.on('data', stdout => console.info(stdout));
  p.stderr.on('data', stderr => console.info(stderr));
}

run();
