// Hook PreToolUse del proyecto Cuadre.
// - Edit/Write: bloquea editar .env, migraciones aplicadas y .git.
// - Bash/PowerShell: bloquea cualquier comando que mencione un archivo .env
//   (excepto .env.example).
// Exit 2 = bloquear; el mensaje de stderr se le muestra a Claude.
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const tool = input.tool_name ?? "";

function bloquear(motivo) {
  console.error(`Bloqueado por política del proyecto: ${motivo}`);
  process.exit(2);
}

if (tool === "Bash" || tool === "PowerShell") {
  const comando = input.tool_input?.command ?? "";
  // Coincide con .env, .env.local, .env.production... pero no con .env.example
  if (/\.env(?!\.example)(?![\w-])|\.env\.(?!example)[\w.-]+/.test(comando)) {
    bloquear("los comandos no pueden tocar archivos .env (contienen secretos). Pide al usuario que lo haga manualmente.");
  }
  process.exit(0);
}

const ruta = (input.tool_input?.file_path ?? "").replace(/\\/g, "/");
if (ruta.endsWith(".env.example")) process.exit(0);

const protegidos = [
  { patron: /(^|\/)\.env(\.|$)/, motivo: "los archivos .env contienen secretos" },
  { patron: /\/prisma\/migrations\//, motivo: "las migraciones ya aplicadas no se editan a mano" },
  { patron: /(^|\/)\.git\//, motivo: "la carpeta .git no se toca" },
];

for (const { patron, motivo } of protegidos) {
  if (patron.test(ruta)) bloquear(`${motivo} (${ruta}).`);
}

process.exit(0);
