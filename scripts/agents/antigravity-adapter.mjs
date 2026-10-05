import { readFileSync } from 'node:fs';
import { evaluarComando, evaluarRuta } from './guard-core.mjs';

function respondDeny(reason) {
  console.log(JSON.stringify({ decision: 'deny', reason }));
}

function respondAsk() {
  console.log(JSON.stringify({ decision: 'ask' }));
}

function respondAllow() {
  console.log(JSON.stringify({ decision: 'allow' }));
}

const allowedPrefixes = [
  "docker compose up -d",
  "Get-ChildItem",
  "Get-Content",
  "Get-Date",
  "git add",
  "git branch --show-current",
  "git commit",
  "git diff",
  "git log",
  "git status",
  "npm run build",
  "npm run lint",
  "npm run test:run",
  "npm run typecheck",
  "npx openspec",
  "npx prisma generate",
  "npx tsc --noEmit",
  "npx vitest run",
  "openspec",
  "Select-String",
  "Test-Path"
];
function esComandoTotalmentePermitido(comando) {
  // Sustituciones de comandos o redirecciones: que decida el humano.
  if (/\$\(|\$\{|>/.test(comando)) return false;

  const separadores = /[;&|`\n]/;
  const segmentos = comando.split(separadores);

  for (const segmento of segmentos) {
    const seg = segmento.trim();
    if (!seg) continue;

    const permitido = allowedPrefixes.some(prefix => seg.startsWith(prefix));
    if (!permitido) return false;
  }
  return true;
}
try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const toolCall = input.toolCall ?? {};
  const name = toolCall.name ?? '';
  const args = toolCall.args ?? {};

  // Map tool names to their protected fields and evaluators
  const toolMap = {
    run_command: {
      field: 'CommandLine',
      evaluator: evaluarComando,
    },
    write_to_file: {
      field: 'TargetFile',
      evaluator: evaluarRuta,
    },
    replace_file_content: {
      field: 'TargetFile',
      evaluator: evaluarRuta,
    },
    multi_replace_file_content: {
      field: 'TargetFile',
      evaluator: evaluarRuta,
    },
    view_file: {
      field: 'AbsolutePath',
      evaluator: evaluarRuta,
    },
  };

  const toolConfig = toolMap[name];
  if (!toolConfig) {
    respondDeny(`herramienta desconocida: ${name}`);
    process.exit(0);
  }

  const value = args[toolConfig.field] ?? '';
  const motivo = toolConfig.evaluator(value);

  if (motivo) {
    respondDeny(motivo);
  } else {
    if (name === 'run_command' && esComandoTotalmentePermitido(value)) {
      respondAllow();
    } else {
      respondAsk();
    }
  }

  process.exit(0);
} catch (error) {
  respondDeny(`error al procesar entrada: ${error.message}`);
  process.exit(0);
}
