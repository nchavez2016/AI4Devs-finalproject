import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const adapterPath = resolve(__dirname, 'antigravity-adapter.mjs');

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

describe('antigravity-adapter', () => {
  describe('traduce cada tipo de toolCall y responde deny cuando guard-core bloquea', () => {
    it.each([
      {
        name: 'run_command protegido',
        input: {
          toolCall: {
            name: 'run_command',
            args: { CommandLine: 'cat .env' },
          },
        },
      },
      {
        name: 'write_to_file protegido',
        input: {
          toolCall: {
            name: 'write_to_file',
            args: { TargetFile: '.git/config' },
          },
        },
      },
      {
        name: 'replace_file_content protegido',
        input: {
          toolCall: {
            name: 'replace_file_content',
            args: { TargetFile: '.claude/settings.json' },
          },
        },
      },
      {
        name: 'multi_replace_file_content protegido',
        input: {
          toolCall: {
            name: 'multi_replace_file_content',
            args: { TargetFile: '.agents/hooks.json' },
          },
        },
      },
      {
        name: 'view_file protegido',
        input: {
          toolCall: {
            name: 'view_file',
            args: { AbsolutePath: 'C:\\proyecto\\.env' },
          },
        },
      },
    ])('responde deny: $name', async ({ input }) => {
      const resultado = await runAdapter(input);
      const response = JSON.parse(resultado.stdout);
      expect(response.decision).toBe('deny');
      expect(response.reason).toBeTruthy();
    });
  });

  describe('responde ask o allow dependiendo de la lista permitida cuando no hay nada que bloquear', () => {
    it('responde ask para comando seguro que no está en la lista de permitidos', async () => {
      const resultado = await runAdapter({
        toolCall: {
          name: 'run_command',
          args: { CommandLine: 'ls' },
        },
      });
      const response = JSON.parse(resultado.stdout);
      expect(response.decision).toBe('ask');
    });

    it('responde allow para comandos en la lista de permitidos', async () => {
      const resultado = await runAdapter({
        toolCall: {
          name: 'run_command',
          args: { CommandLine: 'npm run test:run' },
        },
      });
      const response = JSON.parse(resultado.stdout);
      expect(response.decision).toBe('allow');
    });

    it('responde allow para comandos encadenados donde todos están permitidos', async () => {
      const resultado = await runAdapter({
        toolCall: {
          name: 'run_command',          
		  args: { CommandLine: 'npm run test:run && npx prisma generate' },
        },
      });
      const response = JSON.parse(resultado.stdout);
      expect(response.decision).toBe('allow');
    });

    it('responde ask para comandos encadenados donde uno no está permitido', async () => {
      const resultado = await runAdapter({
        toolCall: {
          name: 'run_command',
          args: { CommandLine: 'npm run test && ls' },
        },
      });
      const response = JSON.parse(resultado.stdout);
      expect(response.decision).toBe('ask');
    });
	    it('responde ask para un comando destructivo de prisma que no está en la lista', async () => {
      const resultado = await runAdapter({
        toolCall: {
          name: 'run_command',
          args: { CommandLine: 'npx prisma migrate reset' },
        },
      });
      const response = JSON.parse(resultado.stdout);
      expect(response.decision).toBe('ask');
    });

    it('responde ask si el comando permitido lleva una sustitución de comando', async () => {
      const resultado = await runAdapter({
        toolCall: {
          name: 'run_command',
          args: { CommandLine: 'npm run lint $(echo x)' },
        },
      });
      const response = JSON.parse(resultado.stdout);
      expect(response.decision).toBe('ask');
    });

    it('responde ask si el comando permitido redirige su salida a un archivo', async () => {
      const resultado = await runAdapter({
        toolCall: {
          name: 'run_command',
          args: { CommandLine: 'npm run lint > salida.txt' },
        },
      });
      const response = JSON.parse(resultado.stdout);
      expect(response.decision).toBe('ask');
    });
	
  });

  describe('responde deny ante entrada inválida o toolCall.name desconocido', () => {
    it('responde deny para entrada no-JSON', async () => {
      const proc = spawn('node', [adapterPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stdin.write('invalid json{');
      proc.stdin.end();

      await new Promise((resolve) => {
        proc.on('close', resolve);
      });

      const response = JSON.parse(stdout);
      expect(response.decision).toBe('deny');
    });

    it('responde deny para toolCall.name desconocido', async () => {
      const resultado = await runAdapter({
        toolCall: {
          name: 'unknown_tool',
          args: {},
        },
      });
      const response = JSON.parse(resultado.stdout);
      expect(response.decision).toBe('deny');
    });
  });
});
