import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { procesarEntrada } from './registrar-prompt.mjs';

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
});
