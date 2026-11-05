import { describe, it, expect } from 'vitest';
import { procesarEntrada } from './registrar-prompt.mjs';

describe('registrar-prompt', () => {
  it('humo: exporta procesarEntrada', () => {
    expect(typeof procesarEntrada).toBe('function');
  });
});
