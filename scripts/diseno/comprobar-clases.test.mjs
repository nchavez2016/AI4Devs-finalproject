import { describe, it, expect } from 'vitest';
import { comprobarArchivo } from './comprobar-clases.mjs';

describe('comprobar-clases', () => {
  it('detecta clases del tema por defecto en cadenas sueltas', () => {
    const codigo = [
      "import { cva } from 'x'",
      "const base = cva('inline-flex p-4 text-cuerpo')",
      "const b = cn('rounded-md', \"text-green-700\", `gap-2 ${x} sm:flex`)",
      "const c = 'bg-primary/10 dark:bg-card p-[13px] shadow-md ease-in-out duration-150'",
      "const d = 'w-96 h-9 -mt-2 inset-0 top-1/2 text-xs bg-white blur-md'",
      "const ok = 'p-ninguno gap-entre-campos text-cuerpo rounded-control shadow-tarjeta escritorio:flex Hola mundo'",
    ].join('\n');

    const hallazgos = comprobarArchivo('src/x.tsx', codigo);

    expect(hallazgos.map((h) => h.clase)).toEqual([
      'p-4',
      'rounded-md',
      'text-green-700',
      'gap-2',
      'sm:flex',
      'bg-primary/10',
      'dark:bg-card',
      'p-[13px]',
      'shadow-md',
      'ease-in-out',
      'duration-150',
      'w-96',
      'h-9',
      '-mt-2',
      'inset-0',
      'top-1/2',
      'text-xs',
      'bg-white',
      'blur-md',
    ]);
    expect(hallazgos[0]).toMatchObject({ archivo: 'src/x.tsx', linea: 2, clase: 'p-4' });
    expect(hallazgos[1]).toMatchObject({ linea: 3, clase: 'rounded-md' });
    expect(hallazgos.every((h) => typeof h.motivo === 'string' && h.motivo.length > 0)).toBe(true);
  });

  it('admite la sintaxis de variable de tema', () => {
    const codigo = [
      "const a = 'duration-(--duracion-base) grid-cols-(--columnas-lista-formulario)'",
      "const b = 'bg-(image:--degradado-marca) animate-entrada px-campo-x size-icono'",
    ].join('\n');

    expect(comprobarArchivo('src/y.tsx', codigo)).toEqual([]);
  });

  it('detecta clases por defecto en @apply', () => {
    const css = [
      '.tarjeta {',
      '  @apply p-4 text-cuerpo;',
      '}',
      '.fila {',
      '  @apply gap-entre-campos',
      '    rounded-lg;',
      '}',
      '.sinProblema {',
      '  @apply px-fila-x rounded-control;',
      '}',
    ].join('\n');

    const hallazgos = comprobarArchivo('src/app/estilos.css', css);

    expect(hallazgos.map((h) => [h.clase, h.linea])).toEqual([
      ['p-4', 2],
      ['rounded-lg', 6],
    ]);
  });
});
