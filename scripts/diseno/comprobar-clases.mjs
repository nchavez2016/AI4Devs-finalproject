// Comprobación de clases del tema por defecto de Tailwind (tokens.md, 3.2).
// Tailwind no avisa cuando una clase no existe: simplemente no genera CSS. Este script
// recorre todas las cadenas de texto de los .ts/.tsx y las reglas @apply de los .css, y
// señala las clases que el sistema de diseño no define.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const MENSAJE_AYUDA = 'Sustitúyela por un token (docs/diseno/sistema/tokens.md, 3.3).';

const PREFIJOS_COLOR =
  'bg|text|border|ring|fill|stroke|from|via|to|decoration|outline|divide|placeholder|caret|accent|shadow';
const FAMILIAS_PALETA =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|mauve|olive|mist|taupe';
const UTILIDADES_ESPACIADO =
  'p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|w|h|size|min-w|min-h|max-w|max-h|inset|inset-x|inset-y|top|right|bottom|left|start|end|translate-x|translate-y|basis|leading|indent';

const REGLAS = [
  {
    motivo: 'Escala numérica del tema por defecto (no existe sin --spacing)',
    prueba: new RegExp(`^(?:${UTILIDADES_ESPACIADO})-(?:\\d+(?:\\.\\d+)?|\\d+/\\d+)$`),
  },
  {
    motivo: 'Tamaño de texto por defecto',
    prueba: /^text-(?:xs|sm|base|lg|xl|[2-9]xl)$/,
  },
  {
    motivo: 'Radio por defecto',
    prueba: /^rounded(?:-(?:none|sm|md|lg|xl|2xl|3xl|full))?$/,
  },
  {
    motivo: 'Sombra por defecto',
    prueba: /^shadow(?:-(?:none|sm|md|lg|xl|2xl|inner))?$/,
  },
  {
    motivo: 'Desenfoque por defecto',
    prueba: /^(?:backdrop-)?blur(?:-[a-z0-9]+)?$/,
  },
  {
    motivo: 'Curva por defecto',
    prueba: /^ease-(?:linear|in|out|in-out)$/,
  },
  {
    motivo: 'Duración con número (usa duration-(--duracion-*))',
    prueba: /^duration-\d+$/,
  },
  {
    motivo: 'Paleta por defecto de Tailwind',
    prueba: new RegExp(`^(?:${PREFIJOS_COLOR})-(?:${FAMILIAS_PALETA})(?:-\\d+)?(?:/\\d+)?$`),
  },
  {
    motivo: 'Blanco o negro literal',
    prueba: /^(?:bg|text|border)-(?:white|black)(?:\/\d+)?$/,
  },
  {
    motivo: 'Clase arbitraria con valor literal (usa utilidad-(--token))',
    prueba: /^-?[a-z][a-z0-9-]*-\[.+\]$/,
  },
  {
    motivo: 'Opacidad sobre un color (no tiene ratio de contraste calculable)',
    prueba: new RegExp(`^(?:${PREFIJOS_COLOR.replace('|shadow', '')})-[a-z][a-z-]*/(?:\\d+|\\[.+\\])$`),
  },
];

const VARIANTES_PROHIBIDAS = [
  { prueba: /^(?:sm|md|lg|xl|2xl)$/, motivo: 'Punto de corte por defecto (usa escritorio: o amplio:)' },
  { prueba: /^dark$/, motivo: 'Variante dark: (el tema oscuro se activa por atributo)' },
];

// Separa "sm:hover:p-4" en variantes ["sm", "hover"] y clase "p-4", sin partir los ":"
// que estén dentro de corchetes o paréntesis.
function separarVariantes(token) {
  const partes = [];
  let actual = '';
  let profundidad = 0;
  for (const caracter of token) {
    if (caracter === '[' || caracter === '(') profundidad += 1;
    if (caracter === ']' || caracter === ')') profundidad -= 1;
    if (caracter === ':' && profundidad === 0) {
      partes.push(actual);
      actual = '';
    } else {
      actual += caracter;
    }
  }
  return { variantes: partes, base: actual };
}

function analizarToken(token) {
  const { variantes, base } = separarVariantes(token);

  for (const variante of variantes) {
    const prohibida = VARIANTES_PROHIBIDAS.find((regla) => regla.prueba.test(variante));
    if (prohibida) return prohibida.motivo;
  }

  const limpia = base.replace(/^!/, '').replace(/^-/, '');
  if (limpia.includes('-(')) return null;

  for (const regla of REGLAS) {
    if (regla.prueba.test(limpia)) return regla.motivo;
  }
  return null;
}

// Devuelve [{ clase, indice, motivo }] para el texto de una cadena.
export function analizarCadena(texto) {
  const hallazgos = [];
  const palabras = /\S+/g;
  let coincidencia;
  while ((coincidencia = palabras.exec(texto)) !== null) {
    const motivo = analizarToken(coincidencia[0]);
    if (motivo) {
      hallazgos.push({ clase: coincidencia[0], indice: coincidencia.index, motivo });
    }
  }
  return hallazgos;
}

function lineaDe(contenido, indice) {
  let linea = 1;
  for (let i = 0; i < indice; i += 1) {
    if (contenido[i] === '\n') linea += 1;
  }
  return linea;
}

function hallazgosDeCodigo(ruta, contenido) {
  const tipo = ruta.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const archivo = ts.createSourceFile(ruta, contenido, ts.ScriptTarget.Latest, true, tipo);
  const resultado = [];

  function registrar(nodo, texto) {
    const inicioTexto = nodo.getStart() + 1;
    for (const hallazgo of analizarCadena(texto)) {
      resultado.push({
        archivo: ruta,
        linea: lineaDe(contenido, inicioTexto) + lineaDe(texto, hallazgo.indice) - 1,
        clase: hallazgo.clase,
        motivo: hallazgo.motivo,
      });
    }
  }

  function visitar(nodo) {
    if (ts.isStringLiteral(nodo) || ts.isNoSubstitutionTemplateLiteral(nodo)) {
      registrar(nodo, nodo.text);
    } else if (
      ts.isTemplateHead(nodo) ||
      ts.isTemplateMiddle(nodo) ||
      ts.isTemplateTail(nodo)
    ) {
      registrar(nodo, nodo.text);
    }
    ts.forEachChild(nodo, visitar);
  }

  visitar(archivo);
  return resultado;
}

function hallazgosDeCss(ruta, contenido) {
  const resultado = [];
  const reglasApply = /@apply\s+([^;}]*)/g;
  let coincidencia;
  while ((coincidencia = reglasApply.exec(contenido)) !== null) {
    const inicioLista = coincidencia.index + coincidencia[0].indexOf(coincidencia[1]);
    for (const hallazgo of analizarCadena(coincidencia[1])) {
      resultado.push({
        archivo: ruta,
        linea: lineaDe(contenido, inicioLista + hallazgo.indice),
        clase: hallazgo.clase,
        motivo: hallazgo.motivo,
      });
    }
  }
  return resultado;
}

// Devuelve [{ archivo, linea, clase, motivo }] ordenado por posición.
export function comprobarArchivo(ruta, contenido) {
  const normalizada = ruta.replace(/\\/g, '/');
  if (/\.(?:ts|tsx)$/.test(normalizada)) return hallazgosDeCodigo(normalizada, contenido);
  if (normalizada.endsWith('.css')) return hallazgosDeCss(normalizada, contenido);
  return [];
}

function esArchivoComprobable(ruta) {
  const normalizada = ruta.replace(/\\/g, '/');
  return (
    (/^src\/.*\.(?:ts|tsx)$/.test(normalizada) && !normalizada.startsWith('src/generated/')) ||
    /^src\/.*\.css$/.test(normalizada)
  );
}

function archivosEnStage() {
  const salida = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
    encoding: 'utf-8',
  });
  return salida.split('\n').filter(Boolean);
}

export function ejecutar(argumentos) {
  const candidatos = argumentos.length > 0 ? argumentos : archivosEnStage();
  const hallazgos = [];
  for (const ruta of candidatos.filter(esArchivoComprobable)) {
    if (!fs.existsSync(ruta)) continue;
    hallazgos.push(...comprobarArchivo(ruta, fs.readFileSync(ruta, 'utf-8')));
  }
  for (const h of hallazgos) {
    console.error(`${h.archivo}:${h.linea}: "${h.clase}" — ${h.motivo}. ${MENSAJE_AYUDA}`);
  }
  return hallazgos.length === 0 ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(ejecutar(process.argv.slice(2)));
}
