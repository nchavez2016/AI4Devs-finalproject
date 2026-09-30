function evaluarPatronComando(comando, patron) {
  return patron.test(comando);
}

export function evaluarComando(comando) {
  // .env pattern: no precedido de \w o $, no seguido de .example
  const patronEnv = /(?<![\w$])\.env(?!\.example\b)(?:\.[\w-]+)*(?![\w-])/i;

  if (evaluarPatronComando(comando, patronEnv)) {
    return 'los comandos no pueden tocar archivos .env (contienen secretos)';
  }

  return null;
}

export function evaluarRuta(_ruta) {
  // TODO: implement
}
