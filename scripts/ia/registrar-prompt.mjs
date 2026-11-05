import fs from 'node:fs';

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
