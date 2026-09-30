import { readFileSync } from 'node:fs';
import { evaluarComando, evaluarRuta } from './guard-core.mjs';

function bloquear(motivo) {
  console.error(`Bloqueado: ${motivo}`);
  process.exit(2);
}

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const tool = input.tool_name ?? '';

  if (tool === 'Bash' || tool === 'PowerShell') {
    const comando = input.tool_input?.command ?? '';
    const motivo = evaluarComando(comando);
    if (motivo) {
      bloquear(motivo);
    }
  } else {
    const ruta = input.tool_input?.file_path ?? '';
    const motivo = evaluarRuta(ruta);
    if (motivo) {
      bloquear(motivo);
    }
  }

  process.exit(0);
} catch (error) {
  bloquear(`falló al procesar entrada (${error.message})`);
}
