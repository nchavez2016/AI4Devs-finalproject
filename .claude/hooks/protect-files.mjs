// Hook PreToolUse del proyecto Cuadre.
// - Edit/Write: bloquea editar .env, migraciones aplicadas, .git y .claude.
// - Bash/PowerShell: bloquea comandos que mencionen archivos .env (excepto .env.example)
//   o las carpetas .claude y .git. No bloquea process.env ni import.meta.env.
// - A prueba de fallos: cualquier error inesperado del hook bloquea la acción.
// Exit 2 = bloquear; el mensaje de stderr se le muestra a Claude.
import { readFileSync } from "node:fs";

function bloquear(motivo) {
  console.error(`Bloqueado por política del proyecto: ${motivo}`);
  process.exit(2);
}

function revisarComando(comando) {
  // Un archivo .env no va precedido de letra, número ni $ (a diferencia de process.env).
  if (/(?<![\w$])\.env(?!\.example\b)(?:\.[\w-]+)*(?![\w-])/.test(comando)) {
    bloquear("los comandos no pueden tocar archivos .env (contienen secretos). Pide al usuario que lo haga manualmente.");
  }
  if (/(^|[\s"'\/\\])\.claude[\/\\]/.test(comando)) {
    bloquear("los comandos no pueden tocar la carpeta .claude (permisos y hooks del agente).");
  }
  if (/(^|[\s"'\/\\])\.git[\/\\]/.test(comando)) {
    bloquear("los comandos no pueden tocar la carpeta .git.");
  }
}

function revisarRuta(rutaOriginal) {
  const ruta = rutaOriginal.replace(/\\/g, "/");
  if (ruta.endsWith(".env.example")) return;

  const protegidos = [
    { patron: /(^|\/)\.env(\.|$)/, motivo: "los archivos .env contienen secretos" },
    { patron: /(^|\/)prisma\/migrations\//, motivo: "las migraciones ya aplicadas no se editan a mano" },
    { patron: /(^|\/)\.git\//, motivo: "la carpeta .git no se toca" },
    { patron: /(^|\/)\.claude\//, motivo: "la carpeta .claude (permisos y hooks) solo la edita el humano" },
  ];

  for (const { patron, motivo } of protegidos) {
    if (patron.test(ruta)) bloquear(`${motivo} (${ruta}).`);
  }
}

try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const tool = input.tool_name ?? "";

  if (tool === "Bash" || tool === "PowerShell") {
    revisarComando(input.tool_input?.command ?? "");
  } else {
    revisarRuta(input.tool_input?.file_path ?? "");
  }
  process.exit(0);
} catch (error) {
  console.error(`Bloqueado por seguridad: el hook protect-files falló (${error.message}). Detente y avisa al usuario.`);
  process.exit(2);
}