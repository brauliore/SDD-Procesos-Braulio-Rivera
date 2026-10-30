# Taller de Spec-Driven Development (SDD)

## Objetivo

Analizar y mejorar una especificación de requisitos elaborada con asistencia de inteligencia artificial.

El objetivo no es aceptar automáticamente lo que propone la IA, sino evaluar la calidad de los requisitos, identificar ambigüedades y justificar las decisiones de mejora.

## Caso de estudio

Una aplicación simple que gestiona tareas personales.

La especificación inicial se encuentra en `requirements/spec-inicial.md`.

## Actividades

1. Leer la especificación completa.
2. Identificar al menos tres ambigüedades, supuestos o decisiones pendientes.
3. Proponer mejoras a los criterios de aceptación.
4. Utilizar IA para explorar alternativas y evaluar críticamente sus propuestas.
5. Documentar las decisiones finales y justificarlas.

## Entregables

- Una especificación revisada.
- Al menos tres decisiones de mejora justificadas.
- Una reflexión breve sobre las limitaciones de utilizar IA para definir requisitos.

## Principio de trabajo

Cada cambio debe responder a una necesidad identificada y contar con una justificación.

No es necesario implementar la aplicación en este taller.

## Aplicación de referencia (opcional)

El repositorio también incluye una implementación responsive de la lista de tareas. Para ejecutarla se requiere Node.js 22.12 o posterior:

```bash
npm install
npm run dev
```

Para validar cambios:

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

## Estructura del repositorio

- `requirements/`: especificación inicial.
- `activities/`: guía de trabajo.
- `deliverables/`: resultados de los estudiantes.
- `specs/001-todo-list/`: especificación, plan y tareas de la aplicación.
- `src/`: capas de aplicación, persistencia e interfaz de usuario.
- `tests/`: pruebas unitarias y de aceptación.