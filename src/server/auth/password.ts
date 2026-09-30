import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto'

const N = 16384
const R = 8
const P = 1
const LONGITUD_CLAVE = 64
const LONGITUD_SAL = 16

// util.promisify no tipa el overload de scrypt con opciones (N/r/p); Node solo expone
// una versión "promisificable" sin opciones. Se envuelve a mano.
function derivarClave(
  password: string,
  sal: Buffer,
  longitud: number,
  opciones: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, sal, longitud, opciones, (error, claveDerivada) => {
      if (error) {
        reject(error)
      } else {
        resolve(claveDerivada)
      }
    })
  })
}

/** Formato: scrypt$N$r$p$salBase64$hashBase64 (design.md, decisión b). */
export async function hashear(password: string): Promise<string> {
  const sal = randomBytes(LONGITUD_SAL)
  const clave = await derivarClave(password, sal, LONGITUD_CLAVE, { N, r: R, p: P })

  return `scrypt$${N}$${R}$${P}$${sal.toString('base64')}$${clave.toString('base64')}`
}

export async function verificar(password: string, hash: string): Promise<boolean> {
  const partes = hash.split('$')

  if (partes.length !== 6 || partes[0] !== 'scrypt') {
    return false
  }

  const [, nStr, rStr, pStr, salBase64, claveBase64] = partes
  const sal = Buffer.from(salBase64, 'base64')
  const claveEsperada = Buffer.from(claveBase64, 'base64')

  const claveCalculada = await derivarClave(password, sal, claveEsperada.length, {
    N: Number(nStr),
    r: Number(rStr),
    p: Number(pStr),
  })

  if (claveCalculada.length !== claveEsperada.length) {
    return false
  }

  return timingSafeEqual(claveCalculada, claveEsperada)
}
