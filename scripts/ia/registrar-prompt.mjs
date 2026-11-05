import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function rutaLogPorDefecto() {
  const rutaScript = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(rutaScript), '../../docs/ia/registro-prompts.jsonl');
}

export function procesarEntrada(texto, rutaLog) {
  if (!texto || texto.trim() === '') {
    return;
  }
  try {
    const objeto = JSON.parse(texto);
    objeto.fechaRegistro = new Date().toISOString();
    fs.appendFileSync(rutaLog, JSON.stringify(objeto) + '\n');
  } catch {
    // Silencia cualquier fallo de parseo o escritura
  }
}

// Bloque de entrada CLI: solo cuando se invoca directamente
const esInvocacionDirecta = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (esInvocacionDirecta) {
  try {
    const texto = fs.readFileSync(0, 'utf8');
    procesarEntrada(texto, rutaLogPorDefecto());
  } catch {
    // Absorbe cualquier error (p.ej. lectura de stdin) sin relanzarlo
  } finally {
    process.exit(0);
  }
}
