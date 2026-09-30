function evaluarPatronComando(comando, patron) {
  return patron.test(comando);
}

function obtenerMotivoBloqueado(comando) {
  // .env pattern: no precedido de \w o $, no seguido de .example
  const patronEnv = /(?<![\w$])\.env(?!\.example\b)(?:\.[\w-]+)*(?![\w-])/i;
  if (evaluarPatronComando(comando, patronEnv)) {
    return 'los comandos no pueden tocar archivos .env (contienen secretos)';
  }

  // .claude/ y .git/ folders (case-insensitive, with or without trailing separator)
  const patronClaude = /(^|[\s"'\/\\])\.claude(?:[\/\\]|$|\s)/i;
  if (patronClaude.test(comando)) {
    return 'los comandos no pueden tocar la carpeta .claude (permisos y hooks del agente)';
  }

  const patronGit = /(^|[\s"'\/\\])\.git(?:[\/\\]|$|\s)/i;
  if (patronGit.test(comando)) {
    return 'los comandos no pueden tocar la carpeta .git';
  }

  // scripts/agents/ and .agents/hooks.json (case-insensitive, with or without trailing separator)
  const patronScriptsAgents = /(^|[\s"'\/\\])scripts[\/\\]agents(?:[\/\\]|$|\s)/i;
  if (patronScriptsAgents.test(comando)) {
    return 'los comandos no pueden tocar scripts/agents';
  }

  const patronAgentsHooks = /(^|[\s"'\/\\])\.agents[\/\\]hooks\.json/i;
  if (patronAgentsHooks.test(comando)) {
    return 'los comandos no pueden tocar .agents/hooks.json';
  }

  return null;
}

function evaluarComandosProtegidos(segmento) {
  // Trim and normalize
  const seg = segmento.trim();
  if (!seg) return null;

  // Split by whitespace to get tokens
  const tokens = seg.split(/\s+/);
  if (tokens.length === 0) return null;

  const primerToken = tokens[0].toLowerCase();

  // git subcommands: push, reset, clean, checkout, switch, merge, rebase
  if (primerToken === 'git') {
    // Find the first non-flag token after 'git'
    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i].toLowerCase();
      if (!token.startsWith('-')) {
        if (['push', 'reset', 'clean', 'checkout', 'switch', 'merge', 'rebase'].includes(token)) {
          return 'los comandos no pueden ejecutar git ' + token;
        }
        break;
      }
    }

    // Check for --no-verify flag in any git command
    if (tokens.some(t => t === '--no-verify')) {
      return 'los comandos no pueden usar el flag --no-verify con git';
    }
  }

  // npm audit fix
  if (primerToken === 'npm' && tokens.length > 2) {
    const segundoToken = tokens[1].toLowerCase();
    const tercerToken = tokens[2].toLowerCase();
    if (segundoToken === 'audit' && tercerToken === 'fix') {
      return 'los comandos no pueden ejecutar npm audit fix';
    }
  }

  return null;
}

export function evaluarComando(comando) {
  // First check for patterns that apply to the whole command
  const motivoGeneral = obtenerMotivoBloqueado(comando);
  if (motivoGeneral) return motivoGeneral;

  // Then check segmented commands
  // Split by command separators: ;, &, |, backtick, newline
  const separadores = /[;&|`\n]/;
  const segmentos = comando.split(separadores);

  for (const segmento of segmentos) {
    const motivoSegmento = evaluarComandosProtegidos(segmento);
    if (motivoSegmento) return motivoSegmento;
  }

  return null;
}

export function evaluarRuta(rutaOriginal) {
  if (rutaOriginal.endsWith('.env.example')) {
    return null;
  }

  // Normalize separators: \ → /
  const ruta = rutaOriginal.replace(/\\/g, '/');

  // Protected patterns for paths (case-insensitive)
  const protegidos = [
    { patron: /(^|\/)\.env(\.|$)/, motivo: 'los archivos de configuración contienen secretos' },
    { patron: /(^|\/)prisma\/migrations\//i, motivo: 'las migraciones ya aplicadas no se editan a mano' },
    { patron: /(^|\/)\.git\//i, motivo: 'la carpeta .git no se toca' },
    { patron: /(^|\/)\.claude\//i, motivo: 'la carpeta de control solo la edita el humano' },
    { patron: /(^|\/)scripts\/agents\//i, motivo: 'la carpeta scripts/agents está protegida' },
    { patron: /(^|\/)\.agents\/hooks\.json$/i, motivo: 'el archivo de hooks está protegido' },
  ];

  for (const { patron, motivo } of protegidos) {
    if (patron.test(ruta)) {
      return motivo;
    }
  }

  return null;
}
