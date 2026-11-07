import { registrarUsuario } from '@/server/auth/registro'
import { listarCategorias } from '@/server/categorias/categorias'
import { crearCuenta } from '@/server/cuentas/cuentas'
import { registrarTransaccion } from '@/server/transacciones/transacciones'

/** Datos de prueba para los tests de integración que pasan por los casos de uso. */

export async function registrarUsuarioDePrueba(nombre: string, email: string) {
  const registro = await registrarUsuario({
    nombre,
    nombreNegocio: `Negocio de ${nombre}`,
    email,
    password: 'clave-segura-1',
  })
  if (!registro.ok) throw new Error('Falló el registro')
  return registro.usuario.id
}

export async function crearCuentaDePrueba(usuarioId: string, nombre: string, saldoInicial = '0.00') {
  const cuenta = await crearCuenta(usuarioId, { nombre, tipo: 'BANCO', saldoInicial })
  if (!cuenta.ok) throw new Error('Falló la creación de la cuenta')
  return cuenta.cuenta.id
}

export async function idCategoria(usuarioId: string, tipo: 'GASTO' | 'INGRESO', nombre: string) {
  const categorias = await listarCategorias(usuarioId)
  const lista = tipo === 'GASTO' ? categorias.gasto : categorias.ingreso
  const categoria = lista.find((c) => c.nombre === nombre)
  if (!categoria) throw new Error(`Falta la categoría ${nombre}`)
  return categoria.id
}

export interface MovimientoDePrueba {
  tipo: 'GASTO' | 'INGRESO'
  monto: string
  fecha: string
  cuentaId: string
  categoria: string
}

export async function registrar(usuarioId: string, movimiento: MovimientoDePrueba) {
  const categoriaId = await idCategoria(usuarioId, movimiento.tipo, movimiento.categoria)
  const resultado = await registrarTransaccion(usuarioId, {
    tipo: movimiento.tipo,
    monto: movimiento.monto,
    fecha: movimiento.fecha,
    cuentaId: movimiento.cuentaId,
    categoriaId,
  })
  if (!resultado.ok) throw new Error('Falló el registro de la transacción')
}
