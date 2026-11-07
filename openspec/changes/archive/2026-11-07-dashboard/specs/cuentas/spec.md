## REMOVED Requirements

### Requirement: Acceso desde el panel
**Reason**: El panel pasa a ser el dashboard (HU-003). Las tarjetas de acceso repiten los enlaces
de la navegación principal de la cabecera, presente en toda pantalla privada (spec `navegacion`),
y el dashboard ofrece "Registrar movimiento" como acción primaria (design.md, decisión 0.4).

**Migration**: Cuentas, Categorías y Transacciones se alcanzan desde la navegación de la cabecera
y del menú móvil. Los tests "El panel enlaza a cuentas y categorías", "El panel enlaza a
transacciones" y "Las tarjetas de acceso del panel tienen un solo enlace" se retiran de
`panel.test.tsx` con autorización del humano (tasks.md, 0.7).
