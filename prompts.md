# prompts.md — Registro de uso de IA · Proyecto Cuadre

Este documento registra cómo se usó la inteligencia artificial en el desarrollo
del proyecto Cuadre, siguiendo lo pedido por la guía del Proyecto Final de
AI4Devs (LIDR). Se actualizará en cada entrega. Cubre: herramientas, modelos y su
uso, agentes/skills/reglas, los prompts o flujos más importantes, y los ajustes
humanos realizados sobre el output de la IA.

---

## 1. Herramientas utilizadas

El proyecto sigue el proceso de desarrollo asistido por IA que enseña el máster
(documentación → arquitectura → tickets → especificación → implementación → QA),
combinando dos herramientas complementarias, cada una en el tipo de tarea donde
rinde mejor. El máster usa como referencia Cursor + Claude Code; en este proyecto
se sustituye Cursor por Google Antigravity como IDE, manteniendo el mismo proceso
y las mismas primitivas (contexto persistente, prompts, MCP), que es lo que el
propio máster señala como lo verdaderamente transferible.

| Herramienta | Rol en el proyecto |
|-------------|--------------------|
| **Claude (chat)** | Copiloto de razonamiento y documentación: análisis del dominio, investigación, redacción y estructuración de toda la documentación de la Entrega 1 (PRD/readme). No genera código en el repositorio. |
| **Claude Code** *(desde Entrega 2)* | Agente de terminal para las **tareas pesadas y autónomas**: generar el scaffold, implementar módulos completos a partir de un ticket/spec, refactorizaciones grandes y ejecución de flujos con subagentes. |
| **Google Antigravity (IDE)** *(desde Entrega 2)* | IDE agéntico (fork de VS Code, con Gemini) usado como **entorno de trabajo principal para lo básico y visual**: leer y entender el código, ediciones puntuales, ajustes finos, autocompletado y revisión de lo que produce Claude Code. Sustituye a Cursor manteniendo el mismo proceso del máster. |
| **NexoRouter** *(previsto, roadmap IA)* | Gateway de modelos compatible con la API de OpenAI, reservado para la futura funcionalidad de asistente IA. No se usa en el MVP. |

**Reparto de trabajo (regla práctica):** lo **pesado y autónomo** (crear, generar,
implementar de cero) se delega a **Claude Code**; lo **básico y de precisión**
(entender, revisar, ajustar, corregir un detalle) se hace en el **IDE
Antigravity**, donde el desarrollador mantiene el control visual del código.

---

## 2. Modelos utilizados y para qué

En la fase de documentación se trabajó con la familia Claude. El criterio de uso
previsto para el desarrollo (Entrega 2 en adelante) reparte los modelos según la
herramienta y el tipo de tarea:

- **Modelo de razonamiento (Claude, tipo Opus / equivalente) en Claude Code** →
  para generar especificaciones (SDD) a partir de cada ticket y para decisiones
  de arquitectura. Es el paso donde "se llenan las lagunas" antes de codear.
- **Modelo rápido (Claude, tipo Sonnet / equivalente) en Claude Code** → para la
  implementación de módulos completos una vez la especificación está clara.
- **Gemini (en el IDE Antigravity)** → para el trabajo dentro del editor: entender
  el código, autocompletado, ediciones puntuales y revisión de los cambios que
  produce Claude Code.

> Nota honesta: la asignación fina de qué modelo para qué tarea se documentará con
> precisión en la Entrega 2, cuando comience el desarrollo real. En la Entrega 1
> (100% documentación) el trabajo fue de razonamiento y redacción con Claude.

---

## 3. Agentes, skills, reglas y comandos personalizados

**Planificado para la fase de construcción (Entrega 2):** un arnés (harness) de
subagentes en Claude Code, siguiendo el patrón del curso:

- **Subagente de especificación (spec / SDD)** — convierte un ticket en una
  especificación detallada. Modelo de razonamiento.
- **Subagente de desarrollo** — implementa la especificación. Modelo rápido.
- **Subagente de QA / revisión** — valida contra los criterios de aceptación y
  genera tests.
- **Archivo de reglas `CLAUDE.md`** — convenciones del proyecto (stack, estilo,
  disciplina TDD, "no modificar tests sin aprobación", etc.) que lee Claude Code.
- **Archivo `AGENTS.md`** — las mismas convenciones en el estándar abierto que
  entiende el IDE Antigravity, para que ambas herramientas compartan el mismo
  contexto del proyecto.

En la Entrega 1 no se crearon agentes de código todavía; el foco fue definir el
producto y su documentación.

---

## 4. Prompts y flujos de trabajo más importantes (Entrega 1)

A continuación, los prompts/flujos clave que produjeron la documentación,
descritos de forma reproducible.

### 4.1. Definición y recorte del MVP
Flujo: partir de una visión amplia (sistema financiero completo con 12 módulos) y
usar la IA para **recortar** a un MVP entregable, contrastando contra la guía
oficial del curso.

> Prompt (resumen): "Contrasta el alcance de mi sistema contra la guía del
> proyecto final. Ayúdame a recortar a un MVP de 3-5 historias must-have que
> demuestre un flujo end-to-end, y deja el resto documentado como roadmap. No
> inventes requisitos que no estén en la guía."

Ajuste humano: la decisión final de qué entra al MVP (cuentas, transacciones,
categorías, dashboard, auth) y qué se documenta como visión futura (ahorros,
presupuestos, préstamos, tarjetas, suscripción, asistente de IA) fue tomada por
el autor, no por la IA.

### 4.2. Definición del modelo de datos en 3FN
Flujo: pedir a la IA un modelo de datos y validarlo explícitamente contra las
formas normales (1FN, 2FN, 3FN).

> Prompt (resumen): "Diseña el modelo de datos del MVP y justifica que cumple la
> Tercera Forma Normal: sin grupos repetidos, sin dependencias parciales, sin
> dependencias transitivas. Señala cualquier redundancia."

Ajuste humano: se revisó que no hubiera datos derivados almacenados (por ejemplo,
no guardar el nombre de la cuenta dentro de la transacción, solo su referencia).

### 4.3. Redacción de historias con criterios Given/When/Then
Flujo: la IA escribió el "happy path" y luego se le pidió expandir casos de error
y borde (patrón "AI as poke-holes" del curso).

> Prompt (resumen): "Para esta historia, escribe criterios de aceptación en
> Given/When/Then. Incluye casos de error y de aislamiento entre usuarios, no
> solo el camino feliz."

Ajuste humano: revisión de cada criterio contra la lógica real de negocio (por
ejemplo, cómo se calcula el saldo de una cuenta).

### 4.4. Adopción del patrón Repository (inspirado en ejemplos del curso)
Flujo: se analizaron proyectos de referencia del curso con el mismo stack
(Next.js + Prisma) y se decidió encapsular el acceso a datos tras una capa de
repositorios, en lugar de llamar a Prisma directamente.

> Prompt (resumen): "Analiza los proyectos de ejemplo del curso con mi stack y
> dime qué patrón de acceso a datos usan. Evalúa si conviene adoptarlo para mi
> MVP sin sobredimensionar."

Ajuste humano: se decidió documentar el patrón pero mantener la implementación
simple (conexión real a PostgreSQL en el MVP), dejando la opción de un
repositorio simulado para pruebas y demos como beneficio, no como obligación.

### 4.5. Estructura del readme según plantilla oficial
Flujo: se analizaron ejemplos reales de entregas del curso para replicar la
estructura 0-7 exacta.

Ajuste humano: se descartó contenido del ejemplo que no aplicaba (por ejemplo,
seguridad tipo OWASP-LLM de un proyecto con chatbot), evitando inflar el
documento con secciones irrelevantes al dominio financiero.

---

### 4.6. Refinamiento del alcance y del modelo (iteración con ejemplos reales)
Flujo: se analizaron proyectos reales del curso (de gastos y del mismo stack) y
se refinó la documentación en varios puntos concretos.

> Prompt (resumen): "Analiza proyectos del curso con mi stack y dominio. Dime qué
> patrones repiten los mejor evaluados y qué debo evitar por sobredimensionar."

Decisiones tomadas por el autor a partir del análisis:
- **Enfoque de usuario genérico** (quitar segmentación geográfica) para no acotar
  artificialmente el producto.
- **Etiquetas de alcance [MVP]/[DOCUMENTADO]** en las funcionalidades, en lugar de
  una lista plana de "fuera de alcance".
- **Modelo con `nombre_negocio` en el usuario** (identidad de negocio sin la
  complejidad de una entidad Empresa separada).
- **Neon** como base de datos gestionada para el despliegue (PostgreSQL puro, sin
  pausa por inactividad); PostgreSQL local vía Docker para desarrollo.
- **Descartar pgvector**: se evaluó y se decidió no incluirlo, por tratarse de
  datos estructurados donde una consulta SQL es suficiente. Evitar
  sobredimensionar es una recomendación explícita de la guía.
- **Seguridad reforzada** siguiendo el enfoque de los mejores ejemplos (Zod,
  Prisma parametrizado, escape XSS de React, endpoints autenticados).

## 5. Ajustes humanos sobre el output de la IA (resumen)

- **Recorte de alcance**: la IA tendía a proponer sistemas completos; el autor
  impuso el recorte a MVP.
- **Decisiones de negocio**: nombre del proyecto, stack, modelo de negocio y
  prioridades las decidió el autor; la IA ofreció opciones.
- **Verificación de datos**: los datos de mercado, precios y regulación se
  marcaron como "a confirmar" en lugar de darlos por ciertos, para no introducir
  alucinaciones.
- **Validación técnica**: normalización 3FN y criterios de aceptación revisados
  manualmente contra la realidad del dominio.

---

## 6. Pendiente para próximas entregas

- Documentar los prompts reales de generación de código (Entrega 2).
- Registrar la configuración concreta de subagentes y `CLAUDE.md`.
- Añadir métricas: qué generó bien la IA a la primera y qué requirió corrección.
