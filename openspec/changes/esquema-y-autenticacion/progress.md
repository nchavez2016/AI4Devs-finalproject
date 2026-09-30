# Progreso: esquema-y-autenticacion

- Siguiente: 4.14 RED — src/app/login/FormularioLogin.test.tsx, "muestra el mensaje genérico de credenciales incorrectas"
- Decisiones: FormularioRegistro usa useActionState + fireEvent.click para probar el submit (React 19 intercepta <form action> también en jsdom, sin necesitar mocks adicionales)
- Discrepancias: ninguna
