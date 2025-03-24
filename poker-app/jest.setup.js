// jest.setup.js
// Ce fichier est exécuté avant chaque test
global.fetch = jest.fn();

// Mock pour next/router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock pour les cookies
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Réinitialiser tous les mocks après chaque test
afterEach(() => {
  jest.clearAllMocks();
});
