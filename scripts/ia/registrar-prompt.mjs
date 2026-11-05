import fs from 'node:fs';

export function procesarEntrada(texto, rutaLog) {
  if (!texto || texto.trim() === '') {
    return;
  }
  const objeto = JSON.parse(texto);
  objeto.fechaRegistro = new Date().toISOString();
  fs.appendFileSync(rutaLog, JSON.stringify(objeto) + '\n');
}
