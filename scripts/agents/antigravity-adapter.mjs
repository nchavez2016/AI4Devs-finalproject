import { readFileSync } from 'node:fs';
import { evaluarComando, evaluarRuta } from './guard-core.mjs';

function respondDeny(reason) {
  console.log(JSON.stringify({ decision: 'deny', reason }));
}

function respondAsk() {
  console.log(JSON.stringify({ decision: 'ask' }));
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
    respondAsk();
  }

  process.exit(0);
} catch (error) {
  respondDeny(`error al procesar entrada: ${error.message}`);
  process.exit(0);
}
