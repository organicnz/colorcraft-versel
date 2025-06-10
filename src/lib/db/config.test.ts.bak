import { getDatabaseConfig, getConnectionString, getClientOptions } from './config';

// Mock environment variables
jest.mock('@/lib/config/env', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
    NEXT_PUBLIC_DATABASE_URL: 'postgres://postgres:password@localhost:5432/test',
    DATABASE_URL: 'postgres://postgres:password@localhost:5432/test',
    NODE_ENV: 'test',
  }
}));

describe('Database configuration', () => {
  describe('getDatabaseConfig', () => {
    it('should return database configuration with expected properties', () => {
      const config = getDatabaseConfig();
      
      expect(config).toHaveProperty('connectionString');
      expect(config).toHaveProperty('options');
      expect(config.options).toHaveProperty('max');
      expect(config.options).toHaveProperty('connectionTimeoutMillis');
    });
    
    it('should have test-appropriate connection pool settings', () => {
      const config = getDatabaseConfig();
      
      // Test environment should have smaller connection pool
      expect(config.options.max).toBeLessThan(10);
      expect(config.options.connectionTimeoutMillis).toBeDefined();
    });
  });
  
  describe('getConnectionString', () => {
    it('should correctly construct connection string from environment', () => {
      const connectionString = getConnectionString();
      
      expect(connectionString).toContain('postgres://');
      expect(connectionString).toContain('localhost:5432');
    });
  });
  
  describe('getClientOptions', () => {
    it('should return different options for different environments', () => {
      // Test environment options (mocked above)
      const testOptions = getClientOptions('test');
      
      // Should have appropriate values for testing
      expect(testOptions.max).toBe(3);
      expect(testOptions.idleTimeoutMillis).toBe(10000);
      
      // Development environment options
      const devOptions = getClientOptions('development');
      expect(devOptions.max).toBe(5);
      
      // Production environment options
      const prodOptions = getClientOptions('production');
      expect(prodOptions.max).toBe(20);
      expect(prodOptions.idleTimeoutMillis).toBeGreaterThan(testOptions.idleTimeoutMillis);
    });
    
    it('should configure statement timeout by environment', () => {
      const testOptions = getClientOptions('test');
      const prodOptions = getClientOptions('production'); 
      
      // Test should have shorter statement timeout
      expect(testOptions.statement_timeout).toBeLessThan(prodOptions.statement_timeout);
    });
  });
});
