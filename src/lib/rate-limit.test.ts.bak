import { checkRateLimit, withRateLimit } from './rate-limit';
import { NextRequest } from 'next/server';

// Mock the headers function from next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Map([['x-forwarded-for', '127.0.0.1']])),
}));

// Mock the logger to prevent actual logging in tests
jest.mock('./logger', () => ({
  apiLogger: {
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  }
}));

describe('Rate limiting utility', () => {
  beforeEach(() => {
    // Reset module internals between tests
    jest.resetModules();
  });
  
  describe('checkRateLimit', () => {
    it('should allow requests under the limit', async () => {
      const result = await checkRateLimit({ limit: 5, identifier: 'test-success' });
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });
    
    it('should deny requests over the limit', async () => {
      // Set up a very low limit
      const options = { limit: 2, identifier: 'test-failure' };
      
      // Make enough requests to exceed the limit
      await checkRateLimit(options);
      await checkRateLimit(options);
      const result = await checkRateLimit(options);
      
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });
    
    it('should use different stores for different identifiers', async () => {
      const result1 = await checkRateLimit({ limit: 5, identifier: 'test-id-1' });
      const result2 = await checkRateLimit({ limit: 5, identifier: 'test-id-2' });
      
      expect(result1.remaining).toBe(4);
      expect(result2.remaining).toBe(4);
    });
  });
  
  describe('withRateLimit', () => {
    it('should pass through the function when under limit', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true, data: 'test' });
      const wrapped = withRateLimit(mockFn, { limit: 5, identifier: 'test-wrapper-1' });
      
      const result = await wrapped('arg1', 'arg2');
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      expect(result).toEqual({ success: true, data: 'test' });
    });
    
    it('should reject the request when over limit', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true, data: 'test' });
      const wrapped = withRateLimit(mockFn, { limit: 1, identifier: 'test-wrapper-2' });
      
      // First call should pass through
      await wrapped();
      
      // Second call should be rate limited
      const result = await wrapped();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(false);
      expect(result.code).toBe('RATE_LIMITED');
    });
  });
});
