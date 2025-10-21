module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Aumentamos el timeout global para dar tiempo a las conexiones de BD
  testTimeout: 30000,

  // Le decimos a Jest que busque los proyectos (y sus tests) en estas carpetas.
  // Esto es más eficiente que escanear todo el árbol de directorios.
  roots: [
    '<rootDir>/auth',
    '<rootDir>/payment',
    '<rootDir>/reservation',
  ],

  // Patrón para encontrar archivos de prueba dentro de los `roots`.
  testMatch: ['**/test/**/*.spec.ts'],

  // Mapeador de módulos. ¡ESTO ES MUY IMPORTANTE!
  // Le enseña a Jest a resolver los alias de importación como '@/...'.
  // Sin esto, Jest no encontrará los módulos y las pruebas fallarán.
  moduleNameMapper: {
    // Cada microservicio necesita su propio mapeo.
    '^@/auth/(.*)$': '<rootDir>/auth/src/$1',
    '^@/payment/(.*)$': '<rootDir>/payment/src/$1',
    '^@/reservation/(.*)$': '<rootDir>/reservation/src/$1',
    // Mapeo genérico para las librerías comunes si es necesario
    '^@/libs/common/(.*)$': '<rootDir>/libs/common/src/$1',
  },

  // Ignoramos la carpeta de librerías comunes si no tiene tests propios
  modulePathIgnorePatterns: ['<rootDir>/libs'],

  // Configuración específica para ts-jest
  globals: {
    'ts-jest': {
      // Usamos un tsconfig base que puede ser extendido por los servicios
      tsconfig: 'tsconfig.json',
      // Aislamos los módulos para evitar conflictos entre tests
      isolatedModules: true,
    },
  },
};