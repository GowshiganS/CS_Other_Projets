// src/lib/auth.test.ts
import { hashPassword, verifyPassword } from './auth';

// Mock des fonctions externes
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation((password, saltRounds) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn().mockImplementation((password, hashedPassword) => {
    return Promise.resolve(hashedPassword === `hashed_${password}`);
  })
}));

describe('Authentication Module', () => {
  // Test du hashage de mot de passe
  test('hashPassword should hash a password correctly', async () => {
    const password = 'testPassword123';
    const hashedPassword = await hashPassword(password);
    
    expect(hashedPassword).toBe(`hashed_${password}`);
  });
  
  // Test de vérification de mot de passe
  test('verifyPassword should return true for correct password', async () => {
    const password = 'testPassword123';
    const hashedPassword = `hashed_${password}`;
    
    const result = await verifyPassword(password, hashedPassword);
    expect(result).toBe(true);
  });
  
  test('verifyPassword should return false for incorrect password', async () => {
    const password = 'testPassword123';
    const incorrectPassword = 'wrongPassword';
    const hashedPassword = `hashed_${password}`;
    
    const result = await verifyPassword(incorrectPassword, hashedPassword);
    expect(result).toBe(false);
  });
});
