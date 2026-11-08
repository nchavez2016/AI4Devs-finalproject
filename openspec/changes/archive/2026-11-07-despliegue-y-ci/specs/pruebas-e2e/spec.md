# Spec Delta

## ADDED Requirements

### Requirement: Reintentos solo en integración continua
La suite E2E SHALL reintentar cada test fallido 2 veces cuando la variable de entorno `CI` está
definida, y 0 veces cuando no lo está, para que en local un fallo intermitente no quede oculto.

#### Scenario: La suite E2E reintenta 2 veces en CI
- **GIVEN** la variable de entorno "CI" vale "true"
- **WHEN** se calculan los reintentos de la suite E2E
- **THEN** son 2

#### Scenario: La suite E2E no reintenta fuera de CI
- **GIVEN** la variable de entorno "CI" no está definida
- **WHEN** se calculan los reintentos de la suite E2E
- **THEN** son 0
