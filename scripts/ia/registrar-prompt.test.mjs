import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { procesarEntrada, rutaLogPorDefecto } from './registrar-prompt.mjs';

describe('registrar-prompt', () => {
  it('humo: exporta procesarEntrada', () => {
    expect(typeof procesarEntrada).toBe('function');
  });

  it('Guarda una línea con payload válido', () => {
    const dirTemporal = fs.mkdtempSync(path.join(os.tmpdir(), 'registro-ia-'));
    const rutaLogTemporal = path.join(dirTemporal, 'registro-prompts.jsonl');
    try {
      procesarEntrada('{"prompt":"hola"}', rutaLogTemporal);
      expect(fs.existsSync(rutaLogTemporal)).toBe(true);
      const contenido = fs.readFileSync(rutaLogTemporal, 'utf-8');
      const lineas = contenido.trim().split('\n');
      expect(lineas).toHaveLength(1);
      const registro = JSON.parse(lineas[0]);
      expect(registro.prompt).toBe('hola');
      expect(registro.fechaRegistro).toBeDefined();
      expect(Number.isNaN(Date.parse(registro.fechaRegistro))).toBe(false);
    } finally {
      fs.rmSync(dirTemporal, { recursive: true, force: true });
    }
  });

  it('Agrega sin sobrescribir', () => {
    const dirTemporal = fs.mkdtempSync(path.join(os.tmpdir(), 'registro-ia-'));
    const rutaLogTemporal = path.join(dirTemporal, 'registro-prompts.jsonl');
    try {
      const lineaPrevia = JSON.stringify({ prompt: 'primero', fechaRegistro: '2026-01-01T00:00:00.000Z' }) + '\n';
      fs.writeFileSync(rutaLogTemporal, lineaPrevia);

      procesarEntrada('{"prompt":"segundo"}', rutaLogTemporal);

      const contenido = fs.readFileSync(rutaLogTemporal, 'utf-8');
      const lineas = contenido.trim().split('\n');
      expect(lineas).toHaveLength(2);
      expect(JSON.parse(lineas[0]).prompt).toBe('primero');
      expect(JSON.parse(lineas[1]).prompt).toBe('segundo');
    } finally {
      fs.rmSync(dirTemporal, { recursive: true, force: true });
    }
  });

  it('Con stdin vacío no falla ni escribe', () => {
    const dirTemporal = fs.mkdtempSync(path.join(os.tmpdir(), 'registro-ia-'));
    const rutaLogTemporal = path.join(dirTemporal, 'registro-prompts.jsonl');
    try {
      expect(() => procesarEntrada('', rutaLogTemporal)).not.toThrow();
      expect(fs.existsSync(rutaLogTemporal)).toBe(false);
    } finally {
      fs.rmSync(dirTemporal, { recursive: true, force: true });
    }
  });

  it('Con JSON inválido no falla', () => {
    const dirTemporal = fs.mkdtempSync(path.join(os.tmpdir(), 'registro-ia-'));
    const rutaLogTemporal = path.join(dirTemporal, 'registro-prompts.jsonl');
    try {
      expect(() => procesarEntrada('"{rota', rutaLogTemporal)).not.toThrow();
      expect(fs.existsSync(rutaLogTemporal)).toBe(false);
    } finally {
      fs.rmSync(dirTemporal, { recursive: true, force: true });
    }
  });

  it('El entorno del proceso no se añade al registro', () => {
    const dirTemporal = fs.mkdtempSync(path.join(os.tmpdir(), 'registro-ia-'));
    const rutaLogTemporal = path.join(dirTemporal, 'registro-prompts.jsonl');
    const clavePrueba = 'CUADRE_TEST_ENV_VAR';
    const valorPrueba = 'secreto_super_confidencial_123';
    process.env[clavePrueba] = valorPrueba;
    try {
      procesarEntrada('{"prompt":"hola sin env"}', rutaLogTemporal);
      const contenido = fs.readFileSync(rutaLogTemporal, 'utf-8');
      expect(contenido).not.toContain(clavePrueba);
      expect(contenido).not.toContain(valorPrueba);
      const registro = JSON.parse(contenido.trim());
      expect(registro).not.toHaveProperty('env');
      expect(registro).not.toHaveProperty('process');
    } finally {
      delete process.env[clavePrueba];
      fs.rmSync(dirTemporal, { recursive: true, force: true });
    }
  });

  it('Resuelve la ruta del log relativa a la raíz del repo', () => {
    const ruta = rutaLogPorDefecto();
    expect(typeof ruta).toBe('string');
    expect(ruta.replace(/\\/g, '/')).toMatch(/docs\/ia\/registro-prompts\.jsonl$/);
  });
});
