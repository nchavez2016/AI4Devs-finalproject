import { describe, it, expect } from 'vitest';
import { evaluarComando, evaluarRuta } from './guard-core.mjs';

describe('evaluarComando', () => {
  describe('bloquea un comando que toca un archivo .env real', () => {
    it.each([
      'cat .env',
      'rm .env.local',
      'cat .ENV',
    ])('bloquea: %s', (comando) => {
      const resultado = evaluarComando(comando);
      expect(resultado).toBeTruthy();
    });
  });

  describe('permite comandos con .env.example, process.env o import.meta.env', () => {
    it.each([
      'cat .env.example',
      'echo process.env',
      'grep import.meta.env src/config.ts',
    ])('permite: %s', (comando) => {
      const resultado = evaluarComando(comando);
      expect(resultado).toBeFalsy();
    });
  });

  describe('bloquea un comando que menciona la carpeta .claude/', () => {
    it.each([
      'rm -rf .claude/hooks',
      'rm -rf .Claude/hooks',
    ])('bloquea: %s', (comando) => {
      const resultado = evaluarComando(comando);
      expect(resultado).toBeTruthy();
    });
  });

  describe('bloquea un comando que menciona la carpeta .git/', () => {
    it('bloquea: rm -rf .git', () => {
      const resultado = evaluarComando('rm -rf .git');
      expect(resultado).toBeTruthy();
    });
  });

  describe('bloquea un comando que menciona scripts/agents/ o .agents/hooks.json', () => {
    it.each([
      'rm -rf scripts/agents',
      'cat .agents/hooks.json',
      'rm -rf Scripts/Agents/',
    ])('bloquea: %s', (comando) => {
      const resultado = evaluarComando(comando);
      expect(resultado).toBeTruthy();
    });
  });

  describe('bloquea los comandos git push, reset, clean, checkout, switch, merge y rebase', () => {
    it.each([
      'git push origin main',
      'git reset --hard',
      'git clean -fd',
      'git checkout main',
      'git switch feature',
      'git merge dev',
      'git rebase main',
      'GIT PUSH origin main',
    ])('bloquea: %s', (comando) => {
      const resultado = evaluarComando(comando);
      expect(resultado).toBeTruthy();
    });
  });

  describe('permite un mensaje de commit que menciona git push sin ejecutarlo', () => {
    it('permite: git commit -m "docs: sobre git push"', () => {
      const resultado = evaluarComando('git commit -m "docs: sobre git push"');
      expect(resultado).toBeFalsy();
    });
  });

  describe('bloquea npm audit fix', () => {
    it('bloquea: npm audit fix --force', () => {
      const resultado = evaluarComando('npm audit fix --force');
      expect(resultado).toBeTruthy();
    });
  });

  describe('bloquea el flag --no-verify', () => {
    it.each([
      'git commit --no-verify -m "x"',
      'git push --no-verify',
    ])('bloquea: %s', (comando) => {
      const resultado = evaluarComando(comando);
      expect(resultado).toBeTruthy();
    });
  });

  describe('aplica las mismas reglas en sintaxis PowerShell', () => {
    it.each([
      'Write-Host ok; git push',
      'git commit --no-verify; git push --no-verify',
      'npm audit fix | grep',
    ])('bloquea en PowerShell: %s', (comando) => {
      const resultado = evaluarComando(comando);
      expect(resultado).toBeTruthy();
    });
  });
});
