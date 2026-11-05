import fs from 'node:fs';

export function procesarEntrada(texto, rutaLog) {
  const objeto = JSON.parse(texto);
  objeto.fechaRegistro = new Date().toISOString();
  fs.appendFileSync(rutaLog, JSON.stringify(objeto) + '\n');
}
