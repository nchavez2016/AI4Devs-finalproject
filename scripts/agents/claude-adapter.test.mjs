import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const adapterPath = resolve(__dirname, 'claude-adapter.mjs');

function runAdapter(input) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [adapterPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });

    proc.on('error', reject);

    proc.stdin.write(JSON.stringify(input));
    proc.stdin.end();
  });
}

describe('claude-adapter', () => {
  describe('bloquea (exit 2) cuando guard-core detecta un comando o ruta protegida', () => {
    it('bloquea un comando Bash protegido', async () => {
      const resultado = await runAdapter({
        tool_name: 'Bash',
        tool_input: { command: 'cat .env' },
      });
      expect(resultado.code).toBe(2);
      expect(resultado.stderr).toBeTruthy();
    });

    it('bloquea una ruta Edit protegida', async () => {
      const resultado = await runAdapter({
        tool_name: 'Edit',
        tool_input: { file_path: '.git/config' },
      });
      expect(resultado.code).toBe(2);
      expect(resultado.stderr).toBeTruthy();
    });
  });

  describe('es a prueba de fallos ante entrada inválida', () => {
    it('bloquea (exit 2) ante entrada no-JSON', async () => {
      const proc = spawn('node', [adapterPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      proc.stdin.write('invalid json{');
      proc.stdin.end();

      const code = await new Promise((resolve) => {
        proc.on('close', resolve);
      });

      expect(code).toBe(2);
    });
  });
});
