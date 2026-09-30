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
});
